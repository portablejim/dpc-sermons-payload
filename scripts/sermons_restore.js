import { getPayload } from 'payload'
import config from '@payload-config'
import { exit } from 'process'
import sqlite from 'node:sqlite'

// Running: pnpm run payload run scripts/sermons_restore.js -- backups/sermons_backup_testing.sqlite

const baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL
const API_KEY = process.env.INTEGRATION_API_KEY

let targetFilename = process.argv[2]

/**
 * @typedef {Object} SqliteSavedRecord
 * @property {number} id
 * @property {Uint8Array} data
 * @property {string} guid
 */

/**
 * @typedef {Object} SavedSvgImage
 * @property {number} id
 * @property {string} guid
 */

/**
 * @typedef SavedImage
 * @property {number} id
 * @property {string} name
 * @property {string} alt
 * @property {string[]} purpose
 * @property {string} filename
 * @property {string} mimetype
 * @property {number} width
 * @property {number} height
 * @property {string} hash
 * @property {string} guid
 *
 */

/**
 *
 * @param {BasePayload} payload
 * @param {CoverImageSvg} bgSvgImgOldObject
 * @returns {Promise<number|null>}
 */
const findExistingSvgImage = async (payload, bgSvgImgOldObject) => {
  try {
    const bgNewById = await payload
      .findByID({
        collection: 'cover-images',
        id: bgSvgImgOldObject.id,
        showHiddenFields: true,
      })
      .catch(() => {
        return null
      })
    if (bgNewById && bgNewById.guid === bgSvgImgOldObject.guid) {
      // GUIDs match, consider them the same.
      console.log(`Existing svg image`)
      return bgNewById.id
    } else {
      // GUIDs don't match. Go looking for the right one.
      const candidateImages = await payload.find({
        collection: 'cover-image-svgs',
        where: {
          guid: {
            equals: bgSvgImgOldObject.guid,
          },
        },
        showHiddenFields: true,
      })
      if (candidateImages && candidateImages.docs.length > 0) {
        console.log('Found existing image')
        return candidateImages.docs[0].id
      } else {
        console.log('New image')
        return null
      }
    }
  } catch (e) {
    console.error({ e, f: 'findExistingSvgImage', bgSvgImgOldObject })
  }
  return null
}

/**
 *
 * @param {BasePayload} payload
 * @param {SavedImage} bgImgOldObject
 * @returns {Promise<number|null>}
 */
const findExistingImage = async (payload, bgImgOldObject) => {
  try {
    const bgNewById = await payload
      .findByID({
        collection: 'cover-images',
        id: bgImgOldObject.id,
        showHiddenFields: true,
      })
      .catch(() => {
        return null
      })
    if (bgNewById && bgNewById.guid === bgImgOldObject.guid) {
      // GUIDs match, consider them the same.
      console.log(`Existing image`)
      return bgNewById.id
    } else {
      // GUIDs don't match. Go looking for the right one.
      const candidateImages = await payload.find({
        collection: 'cover-images',
        where: {
          guid: {
            equals: bgImgOldObject.guid,
          },
        },
        overrideAccess: true,
      })
      if (candidateImages && candidateImages.docs.length > 0) {
        console.log('Found existing image')
        return candidateImages.docs[0].id
      } else {
        console.log('New image')
        return null
      }
    }
  } catch (e) {
    console.error({ e, f: 'findExistingImage', bgImgOldObject })
  }
  return null
}

const findExistingObjectByIdAndGuid = async (payload, oldObject, collectionName) => {
  try {
    const bgNewById = await payload
      .findByID({
        collection: collectionName,
        id: oldObject.id,
        showHiddenFields: true,
      })
      .catch(() => {
        return null
      })
    if (bgNewById && bgNewById.guid === oldObject.guid) {
      // GUIDs match, consider them the same.
      console.log(`Existing ${collectionName}`)
      return bgNewById.id
    } else {
      // GUIDs don't match. Go looking for the right one.
      const candidateObjects = await payload.find({
        collection: collectionName,
        where: {
          guid: {
            equals: oldObject.guid,
          },
        },
      })
      if (candidateObjects && candidateObjects.docs.length > 0) {
        console.log(`Found existing ${collectionName}`)
        return candidateObjects.docs[0].id
      } else {
        console.log(`New ${collectionName}`)
        return null
      }
    }
  } catch (e) {
    console.error({ e, f: 'findExistingImage', bgImgOldObject: oldObject })
  }
  return null
}

const uploadFile = async (objectType, mimeType, fileName, fileData, fileMetadata) => {
  const oldMediaBlobResult = fileData
  const newMediaInput = new FormData()
  newMediaInput.append('file', new Blob([fileData], {
    type: mimeType,
  }), fileName)
  newMediaInput.append('_payload', JSON.stringify(fileMetadata))
  let targetUrl = `${baseUrl}/api/${objectType}`
  const newMediaReq = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      Authorization: `users API-Key ${API_KEY}`,
    },
    body: newMediaInput,
  })
  const newMediaObject = await newMediaReq.json()
  //console.log({uploadResult: newMediaReq.statusText, errors: newMediaObject?.errors})

  return newMediaObject?.doc ? newMediaObject.doc : null
}

/**
 *
 * @param {string} targetFilename Filename to output.
 * @returns {Promise<void>}
 */
const restoreSermons = async (targetFilename) => {
  const payload = await getPayload({ config })

  const coverSvgImagesIdMap = new Map()
  const coverImagesIdMap = new Map()
  const audioFileIdMap = new Map()
  const speakerIdMap = new Map()
  const seriesIdMap = new Map()
  const episodeIdMap = new Map()

  const database = new sqlite.DatabaseSync(targetFilename)

  const coverImageSvgStatement = database.prepare('SELECT * FROM imageSvg')
  let coverImageSvgListIt = coverImageSvgStatement.iterate()
  for (const coverImageSvgRow of coverImageSvgListIt) {
    console.log({ coverImageSvgRow })
    const existingSquareSvgId = await findExistingSvgImage(payload, bgImgSvgOldObject)
    if (existingSquareSvgId) {
      // If an svg image is found, no mapping needs to be done.
      coverSvgImagesIdMap.set(bgImgSvgObject.id, existingSquareSvgId)
    } else {
      // Square SVG not found, it needs to be added.
      const bgSvgImageNewObject = await uploadFile(
        'cover-image-svgs',
        bgSvgImgOldObject.mimeType,
        bgSvgImgOldObject.filename,
        bgImgSvgOldObject.data,
        {
          alt: bgSvgImgOldObject.alt,
          svgFocalPoint: bgSvgImgOldObject.svgFocalPoint ?? null,
          mimeType: bgSvgImgOldObject.mimeType,
          guid: bgSvgImgOldObject.guid ?? null,
        },
      )

      coverSvgImagesIdMap.set(bgImgSvgOldObject.id, bgSvgImageNewObject.id)
    }
  }

  const coverImageStatement = database.prepare('SELECT * FROM image')
  const coverImageListIt = coverImageStatement.iterate()
  for (const coverImageRow of coverImageListIt) {
    // @type {SavedImage}
    const fileMeta = JSON.parse(coverImageRow.metadata)
    const fileData = coverImageRow.data
    const existingImageId = await findExistingImage(payload, fileMeta)
    if (existingImageId) {
      // If an image is found, no mapping needs to be done.
      coverImagesIdMap.set(fileMeta.id, existingImageId)
    } else {
      // Image not found, it needs to be added.

      if (fileMeta.squareSvg) {
        if (!coverSvgImagesIdMap.has(fileMeta.squareSvg)) {
          throw new Error('Square SVG not saved')
        }
        fileMeta.squareSvg = coverSvgImagesIdMap.get(fileMeta.squareSvg)
      }
      if (fileMeta.cardSvg) {
        if (!coverSvgImagesIdMap.has(fileMeta.cardSvg)) {
          throw new Error('Card SVG not saved')
        }
        fileMeta.cardSvg = coverSvgImagesIdMap.get(fileMeta.cardSvg)
      }

      const bgImgNewObject = await uploadFile(
        'cover-images',
        fileMeta.mimeType,
        fileMeta.filename,
        fileData,
        {
          mimeType: fileMeta.mimeType,
          name: fileMeta.name ?? fileMeta.alt, // Use alt instead leaving name blank.
          alt: fileMeta.alt,
          purpose: fileMeta.purpose ?? [],
          squareSvg:
            fileMeta.squareSvg != null && coverImagesMap.has(fileMeta.squareSvg.toString())
              ? coverImagesMap.get(fileMeta.squareSvg.toString())
              : null,
          cardSvg:
            fileMeta.cardSvg != null && coverImagesMap.has(fileMeta.cardSvg.toString())
              ? coverImagesMap.get(fileMeta.cardSvg.toString())
              : null,
          guid: fileMeta.guid,
        },
      )

      if (bgImgNewObject) {
        coverImagesIdMap.set(fileMeta.id, bgImgNewObject.id)
      }
    }
  }

  const audioFileStatement = database.prepare('SELECT * FROM audiofile')
  let audioFileListIt = audioFileStatement.iterate()
  for (const audioFileRecord of audioFileListIt) {
    const fileMeta = JSON.parse(audioFileRecord.metadata)
    const fileData = audioFileRecord.data
    const existingAudioFileId = await findExistingObjectByIdAndGuid(payload, fileMeta, 'talk-audio')
    if (existingAudioFileId) {
      // If an image is found, no mapping needs to be done.
      audioFileIdMap.set(fileMeta.id, existingAudioFileId)
    } else {
      // Image not found, it needs to be added.
      const bgImgNewObject = await uploadFile(
        'talk-audio',
        fileMeta.mimeType,
        fileMeta.filename,
        fileData,
        {
          originalFilename: fileMeta.originalFilename,
          alt: fileMeta.alt,
          uploadedQuality: fileMeta.uploadedQuality,
          lengthDisplay: fileMeta.lengthDisplay,
          status: fileMeta.status,
          guid: fileMeta.guid,
          filename: fileMeta.filename,
          mimeType: fileMeta.mimeType,
          guid: fileMeta.guid,
        },
      )

      if (bgImgNewObject) {
        audioFileIdMap.set(fileMeta.id, bgImgNewObject.id)
      }
    }
  }

  const speakerStatement = database.prepare('SELECT * FROM speaker')
  let speakerListIt = speakerStatement.iterate()
  for (const speakerRecord of speakerListIt) {
    const candidateSpeakerResult = await payload.find({
      collection: 'speakers',
      where: {
        name: {
          equals: speakerRecord.name,
        },
      },
    })
    if(candidateSpeakerResult && candidateSpeakerResult.docs.length > 0) {
      // Existing speaker.
      const newSpeakerId = candidateSpeakerResult.docs[0].id
      console.log(`Existing Speaker ${speakerRecord.id} => ${newSpeakerId}: ${speakerRecord.name}`)
      speakerIdMap.set(speakerRecord.id, newSpeakerId)
    } else {
      // Needs new speaker
      const req = await fetch(`${baseUrl}/api/speakers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `users API-Key ${API_KEY}`,
        },
        body: JSON.stringify({
          name: speakerRecord.name,
          guid: speakerRecord.guid,
        }),
      })
      const newObjectResult = await req.json()

      if (newObjectResult && newObjectResult.doc) {
        console.log(`New Speaker ${speakerRecord.id} => ${newObjectResult.doc.id}: ${speakerRecord.name}`)
        speakerIdMap.set(speakerRecord.id, newObjectResult.doc.id)
      }
    }

  }

  const seriesListStatement = database.prepare('SELECT * FROM series')
  let seriesListIt = seriesListStatement.all()
  let iterationTotal = seriesListIt.length
  let iterationNum = 0;
  for (const seriesRow of seriesListIt) {
    iterationNum += 1
    // @type {SavedImage}
    const fileMeta = JSON.parse(seriesRow.metadata)
    const existingSeriesId = await findExistingObjectByIdAndGuid(payload, fileMeta, 'series')
    if (existingSeriesId) {
      // If an image is found, no mapping needs to be done.
      console.log(`Series ${iterationNum}/${iterationTotal}: Existing '${fileMeta.title}' @ ${existingSeriesId}`)
      seriesIdMap.set(fileMeta.id, existingSeriesId)
    } else {
      // Image not found, it needs to be added.

      if (fileMeta.seriesImage) {
        if (!coverImagesIdMap.has(fileMeta.seriesImage)) {
          throw new Error(`Cover Image ${fileMeta.seriesImage} not saved`)
        }
        fileMeta.seriesImage = coverImagesIdMap.get(fileMeta.seriesImage)
      }

      const req = await fetch(`${baseUrl}/api/series`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `users API-Key ${API_KEY}`,
        },
        body: JSON.stringify({
          title: fileMeta.title,
          subtitle: fileMeta.subtitle,
          slug: fileMeta.slug,
          seriesDate: fileMeta.seriesDate,
          seriesImage: fileMeta.seriesImage,
          seriesType: fileMeta.seriesType,
          guid: fileMeta.guid,
        }),
      })
      const newObjectResult = await req.json()

      if (newObjectResult && newObjectResult.doc) {
        console.log(`Series ${iterationNum}/${iterationTotal}: Added '${fileMeta.title}' @ ${newObjectResult.doc}`)
        seriesIdMap.set(fileMeta.id, newObjectResult.doc.id)
      }
    }
  }

  const episodeListStatement = database.prepare('SELECT * FROM episode')
  const episodeListIt = episodeListStatement.all()
  iterationTotal = episodeListIt.length
  iterationNum = 0;
  for (const episodeRow of episodeListIt) {
    iterationNum += 1
    // @type {SavedImage}
    const fileMeta = JSON.parse(episodeRow.metadata)
    const existingEpisodeId = await findExistingObjectByIdAndGuid(payload, fileMeta, 'episodes')
    if (existingEpisodeId) {
      // If one is found, no mapping needs to be done.
      console.log(`Episode ${iterationNum}/${iterationTotal}: Existing '${fileMeta.title}' @ ${existingEpisodeId}`)
      episodeIdMap.set(fileMeta.id, existingEpisodeId)
    } else {
      // Not found, it needs to be added.

      if (fileMeta.episodeImage) {
        if (!episodeIdMap.has(fileMeta.episodeImage)) {
          throw new Error(`Episode Image Image ${fileMeta.episodeImage} not saved`)
        }
        fileMeta.episodeImage = episodeIdMap.get(fileMeta.episodeImage)
      }
      if (fileMeta.series) {
        if (!seriesIdMap.has(fileMeta.series)) {
          throw new Error(`Series ${fileMeta.series} not saved`)
        }
        fileMeta.series = seriesIdMap.get(fileMeta.series)
        console.log(`Series ${fileMeta.series} => ${fileMeta.series}`)
      }
      if (fileMeta.uploadedAudioFile) {
        if (!audioFileIdMap.has(fileMeta.uploadedAudioFile)) {
          throw new Error(`Audio File ${fileMeta.uploadedAudioFile} not saved`)
        }
        fileMeta.uploadedAudioFile = audioFileIdMap.get(fileMeta.uploadedAudioFile)
      }
      if (fileMeta.speaker) {
        if (!speakerIdMap.has(fileMeta.speaker)) {
          console.log({fileMeta})
          throw new Error(`Speaker ${fileMeta.speaker} not saved`)
        }
        fileMeta.speaker = speakerIdMap.get(fileMeta.speaker)
      }

      const newObjectFields = {
        audioFormat: fileMeta.audioFormat,
        biblePassageText: fileMeta.biblePassageText,
        biblePassages: fileMeta.biblePassages.map(bp => {
          delete bp.id
          return bp
        }),
        episodeImage: fileMeta.episodeImage,
        episodeType: fileMeta.episodeType,
        fullTitle: fileMeta.fullTitle,
        hasValidMedia: fileMeta.hasValidMedia,
        linkedAudioFileSize: fileMeta.linkedAudioFileSize,
        linkedAudioFiletype: fileMeta.linkedAudioFiletype,
        linkedAudioLength: fileMeta.linkedAudioLength,
        linkedAudioUrl: fileMeta.linkedAudioUrl,
        order: fileMeta.order,
        sermonDate: fileMeta.sermonDate,
        sermonDateYear: fileMeta.sermonDateYear,
        series: fileMeta.series,
        speaker: fileMeta.speaker,
        slug: fileMeta.slug,
        subtitle: fileMeta.subtitle,
        talkOutline: fileMeta.talkOutline,
        title: fileMeta.title,
        uploadedAudioFile: fileMeta.uploadedAudioFile,
        videoFormat: fileMeta.videoFormat,
        videoUrl: fileMeta.videoUrl,
        guid: fileMeta.guid,
      }

      const req = await fetch(`${baseUrl}/api/episodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `users API-Key ${API_KEY}`,
        },
        body: JSON.stringify(newObjectFields),
      })
      const newObjectResult = await req.json()

      if (newObjectResult && newObjectResult.doc) {
        console.log(`Series ${iterationNum}/${iterationTotal}: Added '${fileMeta.title}' @ ${newObjectResult.doc.id}`)
        episodeIdMap.set(fileMeta.id, newObjectResult.doc.id)
      } else {
        console.log({error: newObjectResult?.errors, errorData: JSON.stringify(newObjectResult?.errors), object: newObjectFields})
      }
    }
  }
}
await restoreSermons(targetFilename)
exit()
