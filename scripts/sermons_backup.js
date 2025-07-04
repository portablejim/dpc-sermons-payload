import { getPayload } from 'payload'
import config from '@payload-config'
import { exit } from 'process'
import { spawn, execFile, execFileSync } from 'child_process'

// Running: pnpm run payload run scripts/sermon_backup.js -- -1 sermons.toml

import TOML from '@iarna/toml'
import { readFileSync, writeFileSync } from 'fs'
import { createHash } from 'crypto'

let seriesListString = process.argv[2]
let targetFilename = process.argv[3]

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

  seriesList.docs.forEach((seriesInstance) => {
    if (seriesInstance.seriesImage) {
      imageSet.add(seriesInstance.seriesImage)
    }
    seriesSet.add(seriesInstance.id)
    seriesInstance.episodes = null
    seriesMap.set(seriesInstance.id, seriesInstance)
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
  })

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
      : talkAudioList.docs.forEach((talkAudioInstance) => {
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
            audioFileMap.set(talkAudioInstance.id, fileMeta)
          } catch (e) {
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
  speakerList.docs.forEach((speakerInstance) => {
    speakerMap.set(speakerInstance.id, speakerInstance)
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
      imageSvgMap.set(coverImageInstance.id, coverImageInstance)

      let fileHash = createHash('sha1').update(fileData).digest('hex')
      let fileMeta = {
        id: coverImageInstance.id,
        filename: coverImageInstance.filename,
        mimeType: coverImageInstance.mimeType,
        focusX: coverImageInstance.focusX,
        focusY: coverImageInstance.focusY,
        alt: coverImageInstance.alt,
        caption: coverImageInstance.caption,
        data: fileData.toString('base64'),
        hash: fileHash,
        guid: coverImageInstance.guid,
      }
      imageMap.set(coverImageInstance.id, fileMeta)
    } catch (e) {
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
        })
      : { docs: [], totalDocs: 0 }
  coverImageSvgList.docs.forEach((coverImageSvgInstance) => {
    try {
      let filePath = 'public/upload/cover-image-svg/' + coverImageSvgInstance.filename
      let fileData = readFileSync(filePath)
      let fileHash = createHash('sha1').update(fileData).digest('hex')
      let fileMeta = {
        id: coverImageSvgInstance.id,
        alt: coverImageSvgInstance.alt,
        svgFocusPoint: coverImageSvgInstance.svgFocusPoint,
        filename: coverImageSvgInstance.filename,
        mimeType: coverImageSvgInstance.mimeType,
        data: fileData.toString('base64'),
        hash: fileHash,
        guid: coverImageSvgInstance.guid,
      }
      imageSvgMap.set(coverImageSvgInstance.id, coverImageSvgInstance)
    } catch (e) {
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
