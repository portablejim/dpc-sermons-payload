import { getPayload } from 'payload'
import config from '@payload-config'
import { exit } from 'process'
import { spawn, execFile, execFileSync } from 'child_process'
import sqlite from 'node:sqlite'

// Running: pnpm run payload run scripts/sermon_backup.js -- -1 sermons.toml

import TOML from '@iarna/toml'
import { readFileSync, writeFileSync } from 'fs'
import { createHash } from 'crypto'
import { unlinkSync } from 'node:fs'

let seriesListString = process.argv[2]
let targetFilename = process.argv[3]

/**
 *
 * @param {string} seriesListString Series List to use.
 * @param {string} targetFilename Filename to output.
 * @returns {Promise<void>}
 */
const backupSermons = async (seriesListString, targetFilename) => {
  const payload = await getPayload({ config })

  let imageMap = new Map()
  let imageSvgMap = new Map()
  let seriesMap = new Map()
  let episodeMap = new Map()
  let audioFileMap = new Map()
  let speakerMap = new Map()

  let imageSet = new Set()
  let imageSvgSet = new Set()
  let seriesSet = new Set()
  let audioFileSet = new Set()
  let speakerSet = new Set()

  const dbFilename = targetFilename.replace('.toml', '.sqlite')
  unlinkSync(dbFilename)
  const database = new sqlite.DatabaseSync(dbFilename)

  database.exec(`
    CREATE TABLE imageSvg
    (
      id       INTEGER PRIMARY KEY,
      filename TEXT,
      metadata TEXT,
      data     BLOB,
      guid     TEXT
    ) STRICT
  `)
  database.exec(`
    CREATE TABLE image
    (
      id        INTEGER PRIMARY KEY,
      filename  TEXT,
      squareSvg INTEGER,
      coverSvg  INTEGER,
      metadata  TEXT,
      data      BLOB,
      guid      TEXT
    ) STRICT
  `)
  database.exec(`
    CREATE TABLE audiofile
    (
      id       INTEGER PRIMARY KEY,
      filename TEXT,
      metadata TEXT,
      data     BLOB,
      guid     TEXT
    ) STRICT
  `)
  database.exec(`
    CREATE TABLE speaker
    (
      id   INTEGER PRIMARY KEY,
      name TEXT,
      guid TEXT
    ) STRICT
  `)
  database.exec(`
    CREATE TABLE series
    (
      id          INTEGER PRIMARY KEY,
      title       TEXT,
      metadata    TEXT,
      seriesImage INTEGER,
      guid        TEXT
    ) STRICT
  `)
  database.exec(`
    CREATE TABLE episode
    (
      id                INTEGER PRIMARY KEY,
      title             TEXT,
      series            INTEGER,
      uploadedAudioFile INTEGER,
      metadata          TEXT,
      guid              TEXT
    ) STRICT
  `)

  let seriesList = null
  if (['all', '-1'].includes(seriesListString)) {
    seriesList = await payload.find({
      collection: 'series',
      pagination: false,
      depth: 0,
      showHiddenFields: true,
    })
  } else {
    seriesList = await payload.find({
      collection: 'series',
      where: {
        id: {
          in: seriesList,
        },
      },
      pagination: false,
      depth: 0,
      showHiddenFields: true,
    })
  }
  seriesList = await payload.find({
    collection: 'series',
    pagination: false,
    depth: 0,
    showHiddenFields: true,
  })

  const seriesInsert = database.prepare(
    'INSERT INTO series (id, title, metadata, seriesImage, guid) VALUES (?,?,?,?,?)',
  )
  seriesList.docs.forEach((seriesInstance) => {
    if (seriesInstance.seriesImage) {
      imageSet.add(seriesInstance.seriesImage)
    }
    seriesSet.add(seriesInstance.id)
    seriesInstance.episodes = null
    seriesMap.set(seriesInstance.id, seriesInstance)

    seriesInsert.run(
      seriesInstance.id,
      seriesInstance.title,
      JSON.stringify(seriesInstance),
      seriesInstance.seriesImage,
      seriesInstance.guid,
    )
  })

  let episodeList =
    seriesSet.size > 0
      ? await payload.find({
          collection: 'episodes',
          pagination: false,
          depth: 0,
          where: {
            series: {
              in: Array.from(seriesSet).join(','),
            },
          },
          showHiddenFields: true,
        })
      : { docs: [], totalDocs: 0 }

  const episodeInsert = database.prepare(
    'INSERT INTO episode (id, title, series, uploadedAudioFile, metadata, guid) VALUES (?,?,?,?,?,?)',
  )
  /**
   * @param {Episode} episodeInstance
   */
  episodeList.docs.forEach((episodeInstance) => {
    if (episodeInstance.episodeImage) {
      imageSet.add(episodeInstance.episodeImage)
    }
    if (episodeInstance.uploadedAudioFile) {
      audioFileSet.add(episodeInstance.uploadedAudioFile)
    }
    if (episodeInstance.speaker) {
      speakerSet.add(episodeInstance.speaker)
    }
    episodeMap.set(episodeInstance.id, episodeInstance)
    episodeInsert.run(
      episodeInstance.id,
      episodeInstance.title,
      episodeInstance.series,
      episodeInstance.uploadedAudioFile,
      JSON.stringify(episodeInstance),
      episodeInstance.guid,
    )
  })

  console.log(`Getting ${audioFileSet.size} audio files`)
  let talkAudioList =
    audioFileSet.size > 0
      ? await payload.find({
          collection: 'talk-audio',
          pagination: false,
          depth: 0,
          where: {
            id: {
              in: Array.from(audioFileSet).join(','),
            },
          },
          showHiddenFields: true,
        })
      : { docs: [], totalDocs: 0 }
  const talkAudioInsert = database.prepare(
    'INSERT INTO audiofile (id, filename, metadata, data, guid) VALUES (?,?,?,?,?)',
  )
  talkAudioList.docs.forEach((talkAudioInstance) => {
    try {
      let filePath = 'public/upload/talkaudio/' + talkAudioInstance.filename
      let fileData = readFileSync(filePath)
      let fileHash = createHash('sha1').update(fileData).digest('hex')
      let fileMeta = {
        fileValid: true,
        id: talkAudioInstance.id,
        originalFilename: talkAudioInstance.originalFilename,
        alt: talkAudioInstance.alt,
        uploadedQuality: talkAudioInstance.uploadedQuality,
        lengthDisplay: talkAudioInstance.lengthDisplay,
        status: talkAudioInstance.status,
        guid: talkAudioInstance.guid,
        filename: talkAudioInstance.filename,
        mimeType: talkAudioInstance.mimeType,
        data: fileData.toString('base64'),
        hash: fileHash,
        guid: talkAudioInstance.guid,
      }
      audioFileMap.set(talkAudioInstance.id, Object.assign({}, fileMeta))
      talkAudioInsert.run(
        talkAudioInstance.id,
        talkAudioInstance.filename,
        JSON.stringify(fileMeta),
        fileData,
        talkAudioInstance.guid,
      )
    } catch (e) {
      console.error(e)
      audioFileMap.set(talkAudioInstance.id, {
        fileValid: false,
        filename: talkAudioInstance.filename,
      })
    }
  })

  let speakerList = await payload.find({
    collection: 'speakers',
    pagination: false,
    depth: 0,
    where: {
      id: {
        in: Array.from(speakerSet).join(','),
      },
    },
  })
  const speakerInsert = database.prepare('INSERT INTO speaker (id, name, guid) VALUES (?,?,?)')
  speakerList.docs.forEach((speakerInstance) => {
    speakerMap.set(speakerInstance.id, speakerInstance)
    speakerInsert.run(speakerInstance.id, speakerInstance.name, speakerInstance.guid)
  })

  let coverImageList =
    imageSet.size > 0
      ? await payload.find({
          collection: 'cover-images',
          pagination: false,
          depth: 0,
          where: {
            id: {
              in: Array.from(imageSet).join(','),
            },
          },
          showHiddenFields: true,
        })
      : { docs: [], totalDocs: 0 }

  const coverImageInsert = database.prepare(
    'INSERT INTO image (id, filename, squareSvg, coverSvg, metadata, data, guid) VALUES (?,?,?,?,?,?,?)',
  )
  coverImageList.docs.forEach((coverImageInstance) => {
    try {
      let filePath = 'public/upload/cover-images/' + coverImageInstance.filename
      let fileData = readFileSync(filePath)

      if (coverImageInstance.squareSvg) {
        imageSvgSet.add(coverImageInstance.squareSvg)
      }
      if (coverImageInstance.cardSvg) {
        imageSvgSet.add(coverImageInstance.cardSvg)
      }

      let fileHash = createHash('sha1').update(fileData).digest('hex')
      let fileMeta = {
        id: coverImageInstance.id,
        name: coverImageInstance.name,
        alt: coverImageInstance.alt,
        purpose: coverImageInstance.purpose,
        filename: coverImageInstance.filename,
        mimeType: coverImageInstance.mimeType,
        width: coverImageInstance.width,
        height: coverImageInstance.height,
        squareSvg: coverImageInstance.squareSvg,
        cardSvg: coverImageInstance.cardSvg,
        focusX: coverImageInstance.focusX,
        focusY: coverImageInstance.focusY,
        data: fileData.toString('base64'),
        hash: fileHash,
        guid: coverImageInstance.guid,
      }
      imageMap.set(coverImageInstance.id, Object.assign({}, fileMeta))
      delete fileMeta.data
      coverImageInsert.run(
        coverImageInstance.id,
        coverImageInstance.filename,
        coverImageInstance.squareSvg,
        coverImageInstance.cardSvg,
        JSON.stringify(coverImageInstance),
        fileData,
        coverImageInstance.guid,
      )
    } catch (e) {
      console.error(e)
      imageMap.set(coverImageInstance.id, {
        fileValid: false,
        filename: coverImageInstance.filename,
      })
    }
  })

  let coverImageSvgList =
    imageSvgSet.size > 0
      ? await payload.find({
          collection: 'cover-image-svgs',
          pagination: false,
          depth: 0,
          where: {
            id: {
              in: Array.from(imageSvgSet).join(','),
            },
          },
          showHiddenFields: true,
        })
      : { docs: [], totalDocs: 0 }
  const coverImageSvgInsert = database.prepare(
    'INSERT INTO imageSvg (id, filename, metadata, data, guid) VALUES (?,?,?,?,?)',
  )
  coverImageSvgList.docs.forEach((coverImageSvgInstance) => {
    try {
      let filePath = 'public/upload/cover-image-svg/' + coverImageSvgInstance.filename
      let fileData = readFileSync(filePath)
      let fileHash = createHash('sha1').update(fileData).digest('hex')
      let fileMeta = {
        id: coverImageSvgInstance.id,
        alt: coverImageSvgInstance.alt,
        svgFocalPoint: coverImageSvgInstance.svgFocalPoint,
        filename: coverImageSvgInstance.filename,
        mimeType: coverImageSvgInstance.mimeType,
        width: coverImageSvgInstance.width,
        height: coverImageSvgInstance.height,
        data: fileData.toString('base64'),
        hash: fileHash,
        guid: coverImageSvgInstance.guid,
      }
      imageSvgMap.set(coverImageSvgInstance.id, Object.assign({}, fileMeta))
      delete fileMeta.data
      coverImageSvgInsert.run(
        coverImageSvgInstance.id,
        coverImageSvgInstance.filename,
        JSON.stringify(fileMeta),
        fileData,
        coverImageSvgInstance.guid ?? null,
      )
    } catch (e) {
      console.error(e)
      imageSvgMap.set(coverImageSvgInstance.id, {
        fileValid: false,
        filename: coverImageSvgInstance.filename,
      })
    }
  })

  let outputObj = {
    images: Object.fromEntries(imageMap),
    imageSvgs: Object.fromEntries(imageSvgMap),
    series: Object.fromEntries(seriesMap),
    episodes: Object.fromEntries(episodeMap),
    audioFiles: Object.fromEntries(audioFileMap),
    speakers: Object.fromEntries(speakerMap),
  }

  let outputStr = TOML.stringify(outputObj)

  writeFileSync(targetFilename, outputStr)

  return
}
await backupSermons(seriesListString, targetFilename)
exit()
