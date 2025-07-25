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

const baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL
const API_KEY = process.env.INTEGRATION_API_KEY

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
          guid: {
            equals: bgSvgImgOldObject.guid
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
    console.error({e, f: 'findExistingSvgImage', bgSvgImgOldObject})
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
          guid: {
            equals: bgImgOldObject.guid
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
    console.error({e, f: 'findExistingImage', bgImgOldObject})
  }
  return null
}

const uploadFile = async (objectType, mimeType, fileName, fileData, fileMetadata) => {
  const oldMediaBlobResult = await fetch(`data:${mimeType};base64,${fileData}`)
  const newMediaInput = new FormData()
  newMediaInput.append('file', await oldMediaBlobResult.blob(), fileName)
  newMediaInput.append('_payload', JSON.stringify(fileMetadata))
  const newMediaReq = await fetch(`${baseUrl}/api/${objectType}`, {
    method: 'POST',
    headers: {
      Authorization: `users API-Key ${API_KEY}`,
    },
    body: newMediaInput,
  })
  const newMediaObject = await newMediaReq.json()

  return newMediaObject?.doc ? newMediaObject.doc : null
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

  let layoutsNew = []
  for (const layout of restoreFileToml.page.layout) {
    if (layout.blockType === 'linkTileList') {
      for(const linkTile of layout.linkTiles) {
        const bgImgOldId = linkTile.linkTile.backgroundImage
        const bgImgOldObject = coverImagesMap.get(bgImgOldId.toString())
        if (!coverImagesIdMap.has(bgImgOldId)) {
          if (bgImgOldObject) {
            const existingImageId = await findExistingImage(payload, bgImgOldObject)
            if (existingImageId) {
              // If an image is found, no mapping needs to be done.
              coverImagesIdMap.set(bgImgOldObject.id, existingImageId, bgImgOldObject)
            } else {
              // Image not found, it needs to be added.

              if (bgImgOldObject.squareSvg) {
                const bgImgSvgOldObject = cov
                const existingSquareSvgId = await findExistingSvgImage(
                  payload,
                  bgImgSvgOldObject,
                )
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
              if (bgImgOldObject.cardSvg) {
                const bgImgSvgOldObject = cov
                const existingcoverSvgId = await findExistingSvgImage(
                  payload,
                  bgImgSvgOldObject,
                )
                if (existingcoverSvgId) {
                  // If an svg image is found, no mapping needs to be done.
                  coverSvgImagesIdMap.set(bgImgSvgObject.id, existingcoverSvgId)
                } else {
                  // Cover SVG not found, it needs to be added.
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

              const bgImgNewObject = await uploadFile(
                'cover-images',
                bgImgOldObject.mimeType,
                bgImgOldObject.filename,
                bgImgOldObject.data,
                {
                  mimeType: bgImgOldObject.mimeType,
                  name: bgImgOldObject.name ?? null,
                  alt: bgImgOldObject.alt,
                  purpose: bgImgOldObject.purpose ?? [],
                  squareSvg:
                    bgImgOldObject.squareSvg != null &&
                    coverImagesMap.has(bgImgOldObject.squareSvg.toString())
                      ? coverImagesMap.get(bgImgOldObject.squareSvg.toString())
                      : null,
                  cardSvg:
                    bgImgOldObject.cardSvg != null &&
                    coverImagesMap.has(bgImgOldObject.cardSvg.toString())
                      ? coverImagesMap.get(bgImgOldObject.cardSvg.toString())
                      : null,
                  guid: bgImgOldObject.guid,
                },
              )

              if(bgImgNewObject)
              {
                coverImagesIdMap.set(bgImgOldId.id, bgImgNewObject.id)
              }
            }
          } else {
            console.log('Error getting image id ' + bgImgOldId)
          }
        }
        if (coverImagesIdMap.has(bgImgOldId)) {
          const newImageId = coverImagesIdMap.get(bgImgOldId)
          linkTile.linkTile.backgroundImage = newImageId
        } else {
          const globalDefaults = await payload.findGlobal({
            slug: 'defaults',
          })
          linkTile.linkTile.backgroundImage = globalDefaults.defaultCoverImage
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
                linkTile.linkTile.reference.value = parseInt(targetId)
              }
            }
          } else {
            // Something is wrong with the saved data. Set to itself.
            linkTile.linkTile.reference.value = parseInt(targetId)
          }
        } else if (linkTile.linkTile.type == 'mediaReference') {
          if (
            linkTile.linkTile.linkedMedia &&
            mediaMap.has(linkTile.linkTile.linkedMedia.toString())
          ) {
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
              linkTile.linkTile.reference = null
            } else {
              // No matching doc found => need to add it.
              const newMediaObject = await uploadFile(
                'media',
                oldMedia.mimeType,
                oldMedia.filename,
                oldMedia.data,
                {
                  filename: oldMedia.filename,
                  mimeType: oldMedia.mimeType,
                  alt: oldMedia.alt,
                  length: oldMedia.size,
                  caption: JSON.parse(oldMedia.caption),
                  guid: oldMedia.guid,
                },
              )
              if (newMediaObject?.id) {
                linkTile.linkTile.linkedMedia = newMediaObject.id
              }
              linkTile.linkTile.reference = null
            }
          } else {
            // Something is wrong with the saved data. Set it to a self page reference.
            linkTile.linkTile.type = 'reference'
            linkTile.linkTile.reference = {
              relationTo: 'pages',
              value: parseInt(targetId)
            }
          }
        }
      }
    }
    layoutsNew.push(layout)
  }
  const req = await fetch(`${baseUrl}/api/pages/${targetId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `users API-Key ${API_KEY}`,
    },
    body: JSON.stringify({
      layout: layoutsNew,
    }),
  })
  const updatedPage = await req.json()
  console.log({updatedPage})
}
await restorePage(targetId, targetFilename)
exit()
