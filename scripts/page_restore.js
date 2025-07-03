import { getPayload } from 'payload'
import config from '@payload-config'
import { exit } from 'process'
import { spawn, execFile, execFileSync } from 'child_process'

// Running: pnpm run payload run scripts/page_restore.js 4 membershub.toml

import TOML from '@iarna/toml'
import fs, { readFileSync, writeFileSync } from 'fs'
import { createHash } from 'crypto'
import { decodeFromBase64 } from 'next/dist/build/webpack/loaders/utils.js'
import * as util from 'node:util'

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

  const pageMap = new Map()
  Object.entries(restoreFileToml.refPages).forEach(([key, value]) => {
    pageMap.set(key, value)
  })

  const mediaMap = new Map()
  Object.entries(restoreFileToml.media).forEach(([key, value]) => {
    mediaMap.set(key, value)
  })
  const mediaIdMap = new Map()

  const coverSvgImagesMap = new Map()
  Object.entries(restoreFileToml.imageSvgs).forEach(([key, value]) => {
    coverSvgImagesMap.set(key, value)
  })
  const coverSvgImagesIdMap = new Map()

  const coverImagesMap = new Map()
  Object.entries(restoreFileToml.images).forEach(([key, value]) => {
    coverImagesMap.set(key, value)
  })
  const coverImagesIdMap = new Map()

  //console.log(util.inspect(restoreFileToml.page, false, null, true))
  let layoutNew = await Promise.all(
    restoreFileToml.page.layout.map(async (layout) => {
      if (layout.blockType === 'linkTileList') {
        layout.linkTiles =  await Promise.all(
          layout.linkTiles.map(async (linkTile) => {
            const bgImgOldId = linkTile.linkTile.backgroundImage
            const bgImgOldObject = coverImagesMap.get(bgImgOldId.toString())
            if (!coverImagesIdMap.has(bgImgOldId)) {
              if (bgImgOldObject) {
                const existingImageId = await findExistingImage(payload, bgImgOldObject)
                if (existingImageId) {
                  // If an image is found, no mapping needs to be done.
                  coverImagesIdMap.set(bgImgOldObject.id, existingImageId)
                } else {
                  // Image not found, it needs to be added.

                  if (bgImgOldObject.squareSvg) {
                    const bgImgSvgOldObject = cov
                    const existingSquareSvgId = await findExistingSvgImage(payload, bgImgSvgOldObject)
                    if (existingSquareSvgId) {
                      // If an svg image is found, no mapping needs to be done.
                      coverSvgImagesIdMap.set(bgImgSvgObject.id, existingSquareSvgId)
                    } else {
                      // Square SVG not found, it needs to be added.
                      const newSvgImgFile = new File(
                        Buffer.from(bgImgSvgOldObject.data, 'base64'),
                        bgImgSvgOldObject.filename,
                      )
                      const bgSvgImageNewObject = await payload.create({
                        collection: 'cover-image-svgs',
                        data: {
                          alt: bgSvgImgOldObject.alt,
                          svgFocalPoint: bgSvgImgOldObject.svgFocalPoint ?? null,
                          mimeType: bgSvgImgOldObject.mimeType,
                          guid: bgSvgImgOldObject.guid ?? null,
                        },
                        file: newSvgImgFile,
                      })

                      coverSvgImagesIdMap.set(bgImgSvgOldObject.id, bgSvgImageNewObject.id)
                    }
                  }
                  if (bgImgOldObject.coverSvg) {
                    const bgImgSvgOldObject = cov
                    const existingcoverSvgId = await findExistingSvgImage(payload, bgImgSvgOldObject)
                    if (existingcoverSvgId) {
                      // If an svg image is found, no mapping needs to be done.
                      coverSvgImagesIdMap.set(bgImgSvgObject.id, existingcoverSvgId)
                    } else {
                      // Cover SVG not found, it needs to be added.
                      const newSvgImgFile = new File(
                        Buffer.from(bgImgSvgOldObject.data, 'base64'),
                        bgImgSvgOldObject.filename,
                      )
                      const bgSvgImageNewObject = await payload.create({
                        collection: 'cover-image-svgs',
                        data: {
                          alt: bgSvgImgOldObject.alt,
                          svgFocalPoint: bgSvgImgOldObject.svgFocalPoint ?? null,
                          mimeType: bgSvgImgOldObject.mimeType,
                          guid: bgSvgImgOldObject.guid ?? null,
                        },
                        file: newSvgImgFile,
                      })

                      coverSvgImagesIdMap.set(bgImgSvgOldObject.id, bgSvgImageNewObject.id)
                    }
                  }

                  const newImgFile = new File(
                    Buffer.from(bgImgOldObject.data, 'base64'),
                    bgImgOldObject.filename,
                  )
                  const bgImgNewObject = await payload.create({
                    collection: 'cover-images',
                    data: {
                      mimeType: bgImgOldObject.mimeType,
                      name: bgImgOldObject.name ?? null,
                      alt: bgImgOldObject.alt,
                      purpose: bgImgOldObject.purpose ?? [],
                      squareSvg:
                        bgImgOldObject.squareSvg != null &&
                        coverImagesMap.has(bgImgOldObject.squareSvg.toString())
                          ? coverImagesMap.get(bgImgOldObject.squareSvg.toString())
                          : null,
                      coverSvg:
                        bgImgOldObject.coverSvg != null &&
                        coverImagesMap.has(bgImgOldObject.coverSvg.toString())
                          ? coverImagesMap.get(bgImgOldObject.coverSvg.toString())
                          : null,
                      guid: bgImgOldObject.guid ?? null,
                    },
                    file: newImgFile,
                  })
                  coverImagesIdMap.set(bgImgOldId.id, bgImgNewObject.id)
                }
              } else {
                console.log('Error getting image id ' + bgImgOldId)
              }
            } else {
              console.log('Unmapped image id ' + bgImgOldId)
            }
            if (coverImagesIdMap.has(bgImgOldId)) {
              const newImageId = coverImagesIdMap.get(bgImgOldId)
              linkTile.linkTile.backgroundImage = newImageId
            } else {
              linkTile.linkTile.backgroundImage = null
            }

            delete linkTile.id
            if (linkTile.linkTile.type == 'custom') {
              linkTile.linkTile.reference = null
            } else if (linkTile.linkTile.type == 'reference') {
              if (
                linkTile.linkTile.reference.value &&
                pageMap.has(linkTile.linkTile.reference.value.toString())
              ) {
                const oldPage = pageMap.get(linkTile.linkTile.reference.value.toString())
                let existingPage = await payload
                  .findByID({
                    collection: 'pages',
                    id: linkTile.linkTile.reference.value,
                  })
                  .catch(() => {
                    return null
                  })

                if (existingPage && oldPage.slug === existingPage.slug) {
                  // Existing page exists and has the same slug => consider them equal.
                } else {
                  // Existing page does not exist or is not correct.
                  const candidatePageQuery = await payload.find({
                    collection: 'pages',
                    where: {
                      or: [
                        {
                          title: {
                            equals: oldPage.title,
                          },
                        },
                        {
                          slug: {
                            equals: oldPage.slug,
                          },
                        },
                      ],
                    },
                  })
                  if (candidatePageQuery.docs.length > 0) {
                    // Found a matching page.
                    linkTile.linkTile.reference.value = candidatePageQuery.docs[0].id
                  } else {
                    // Matching page not found, link to itself.
                    linkTile.linkTile.reference.value = restoreFileToml.page.id
                  }
                }
              } else {
                // Something is wrong with the saved data. Set to itself.
                linkTile.linkTile.reference.value = restoreFileToml.page.id
              }
            } else if (linkTile.linkTile.type == 'mediaReference') {
              if (linkTile.linkTile.linkedMedia && mediaMap.has(linkTile.linkTile.linkedMedia.toString())) {
                const oldMedia = mediaMap.get(linkTile.linkTile.linkedMedia.toString())
                const candidateNewMedia = await payload.find({
                  collection: 'media',
                  where: {
                    guid: {
                      equals: oldMedia.guid,
                    },
                  },
                })
                if (candidateNewMedia.docs.length > 0) {
                  // Found a matching doc.
                  linkTile.linkTile.linkedMedia = candidateNewMedia.docs[0].id
                } else {
                  // No matching doc found => need to add it.
                  const newMediaFile = new File(
                    Buffer.from(oldMedia.data, 'base64'),
                    oldMedia.filename,
                  )
                  const newMediaObject = await payload.create({
                    collection: 'media',
                    data: {
                      filename: oldMedia.filename,
                      mimeType: oldMedia.mimeType,
                      alt: oldMedia.alt,
                      caption: JSON.parse(oldMedia.caption),
                      guid: oldMedia.guid,
                    },
                    file: newMediaFile,
                  })

                  linkTile.linkTile.linkedMedia = newMediaObject.id
                }
              } else {
                // Something is wrong with the saved data. Set it to a self page reference.
                linkTile.linkTile.type = 'reference'
                linkTile.linkTile.reference = {
                  relationTo: 'pages',
                  value: restoreFileToml.page.id,
                }
              }
            }
            return linkTile
          }),
        )

      }
      return layout
    }),
  )
  const baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL
  const API_KEY = process.env.INTEGRATION_API_KEY
  const req = await fetch(`${baseUrl}/api/pages/${targetId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `users API-Key ${API_KEY}`,
    },
    body: JSON.stringify({
      layout: layoutNew
    }),
  })
  const updatedPage = await req.json()
  console.log(util.inspect(updatedPage, false, null, true))
}
await restorePage(targetId, targetFilename)
exit()
