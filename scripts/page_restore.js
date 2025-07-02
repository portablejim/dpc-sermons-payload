import { getPayload } from 'payload'
import config from '@payload-config'
import { exit } from 'process'
import { spawn, execFile, execFileSync } from 'child_process'

// Running: pnpm run payload run scripts/page_restore.js 4 membershub.toml

import TOML from '@iarna/toml'
import fs, { readFileSync, writeFileSync } from 'fs'
import { createHash } from 'crypto'
import { decodeFromBase64 } from 'next/dist/build/webpack/loaders/utils.js'

let targetId = process.argv[2]
let targetFilename = process.argv[3]

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
          guid: payload.guid,
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
    console.error(e)
  }
  return null
}

const findExistingImage = async (payload, bgImgOldObject) => {
  try {
    const bgNewById = await payload
      .findByID({
        collection: 'cover-images',
        id: bgImgOldObject.id,
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
          guid: payload.guid,
        },
        showHiddenFields: true,
      })
      //console.log({candidateImages})
      if (candidateImages && candidateImages.docs.length > 0) {
        console.log('Found existing image')
        return candidateImages.docs[0].id
      } else {
        console.log('New image')
        return null
      }
    }
  } catch (e) {
    console.error(e)
  }
  return null
}

const restorePage = async (targetId, targetFilename) => {
  const payload = await getPayload({ config })
  const restoreFileStr = fs.readFileSync(targetFilename)
  const restoreFileToml = TOML.parse(restoreFileStr)
  //console.log(Object.entries(restoreFileToml.media))
  let mediaMap = new Map()
  Object.entries(restoreFileToml.media).forEach(([key, value]) => {
    mediaMap.set(key, value)
  })
  const mediaIdMap = new Map()

  let coverImagesMap = new Map()
  Object.entries(restoreFileToml.images).forEach(([key, value]) => {
    coverImagesMap.set(key, value)
  })
  const coverImagesIdMap = new Map()

  await Promise.all(
    restoreFileToml.page.layout.map(async (layout) => {
      if (layout.blockType === 'linkTileList') {
        const newLinkTileList = await Promise.all(
          layout.linkTiles.map(async (linkTile) => {
            const bgImgOldId = linkTile.linkTile.backgroundImage
            const bgImgOldObject = coverImagesMap.get(bgImgOldId.toString())
            if (!coverImagesIdMap.has(bgImgOldId)) {
              if (bgImgOldObject) {
                const existingImage = await findExistingImage(payload, bgImgOldObject)
                if (existingImage) {
                  // If an image is found, no mapping needs to be done.
                  coverImagesIdMap.set(existingImage.id, existingImage.id)
                } else {
                  // Image not found, it needs to be added.

                  if(bgImgOldObject.squareSvg) {
                    const bgImgSvgObject = cov
                    const existingSquareSvg = await findExistingSvgImage(payload, )
                  }

                  const newImgFile = new File(
                    Buffer.from(bgImgOldObject.data, 'base64'),
                    bgImgOldObject.filename,
                  )
                  console.log({ bgImgOldObject, newImgFile })
                  const bgImgNewObject = await payload.create({
                    collection: 'cover-images',
                    data: {
                      mimeType: bgImgOldObject.mimeType,
                      name: bgImgOldObject.name ?? null,
                      alt: bgImgOldObject.alt,
                      purpose: bgImgOldObject.purpose ?? [],
                      guid: bgImgOldObject.guid ?? null,
                    },
                    file: newImgFile,
                  })

                  coverImagesIdMap.set(bgImgOldId.id, bgImgNewObject.id)
                }
              } else {
                console.log('Error getting image id ' + bgImgOldId)
              }
            }
            if (coverImagesIdMap.has(bgImgOldId)) {
              const newImageId = coverImagesIdMap.get(bgImgOldId)
              linkTile.linkTile.backgroundImage = newImageId
            }
            else {
              linkTile.linkTile.backgroundImage = null;
            }

            linkTile.id = null;
            if(linkTile.linkTile.type == 'custom') {
              linkTile.linkTile.reference = null;
            }
            else if(linkTile.linkTile.type == 'reference') {
              // TEMP - Link to itself - The resolving of pages is not yet built.
              linkTile.linkTile.reference.value = restoreFileToml.page.id;
            }
            console.log({linkTile: linkTile.linkTile})
            return linkTile
          }),
        )
      }
    }),
  )
  //console.log(restoreFileToml.page.layout)
}
await restorePage(targetId, targetFilename)
exit()
