import { getPayload } from 'payload'
import config from '@payload-config'
import { exit } from 'process'
import { spawn, execFile, execFileSync } from 'child_process'

// Running: pnpm run payload run scripts/page_backup.js 4 membershub.toml

import TOML from '@iarna/toml'
import { readFileSync, writeFileSync } from 'fs'
import { createHash } from 'crypto'

let targetId = process.argv[2]
let targetFilename = process.argv[3]

const backupPage = async (targetId, targetFilename) => {
  const payload = await getPayload({ config })

  let targetPage = await payload.findByID({
    collection: 'pages',
    id: targetId,
    depth: 2,
    showHiddenFields: true,
  })

  let imageMap = new Map()
  let imageSvgMap = new Map()
  let mediaMap = new Map()
  let pagesMap = new Map()

  targetPage.layout.forEach((layoutInstance) => {
    if (layoutInstance.blockType == 'linkTileList' && layoutInstance.linkTiles) {
      layoutInstance.linkTiles.forEach(async (linkTile) => {
        if (linkTile?.linkTile?.backgroundImage) {
          let targetImage = linkTile?.linkTile?.backgroundImage
          let targetImageId = targetImage.id
          if (!imageMap.has(targetImage.id)) {
            let overrideSvgs = []
            let squareSvgId = null
            let cardSvgId = null
            if(targetImage.squareSvg) {
              overrideSvgs.push(targetImage.squareSvg)
              squareSvgId = targetImage.squareSvg.id
            }
            if(targetImage.cardSvg) {
              overrideSvgs.push(targetImage.cardSvg)
              cardSvgId = targetImage.cardSvg.id
            }
            overrideSvgs.forEach((overrideSvg) => {
              if(!imageSvgMap.has(overrideSvg.id)) {
                try {
                  let filePath = 'public/upload/cover-image-svg/' + overrideSvg.filename
                  let fileData = readFileSync(filePath)
                  let fileHash = createHash('sha1').update(fileData).digest('hex')
                  let fileMeta = {
                    id: overrideSvg.id,
                    alt: overrideSvg.alt,
                    svgFocalPoint: overrideSvg.svgFocalPoint,
                    filename: overrideSvg.filename,
                    mimeType: overrideSvg.mimeType,
                    width: overrideSvg.width,
                    height: overrideSvg.height,
                    data: fileData.toString('base64'),
                    hash: fileHash,
                    guid: overrideSvg.guid,
                  }
                  imageSvgMap.set(overrideSvg.id, fileMeta)
                } catch (e) {
                  payload.logger.error(`Error while saving ${overrideSvg.filename}.`)
                  payload.logger.error(e)
                }
              }
            })

            // They aren't in the map, so don't store the Id
            if(cardSvgId != null && !imageSvgMap.has(cardSvgId.id)) {
              cardSvgId = null
            }
            if(squareSvgId != null && imageSvgMap.has(squareSvgId.id)) {
              squareSvgId = null
            }

            try {
              let filePath = 'public/upload/cover-images/' + targetImage.filename
              let fileData = readFileSync(filePath)
              let fileHash = createHash('sha1').update(fileData).digest('hex')
              let fileMeta = {
                id: targetImage.id,
                name: targetImage.name,
                alt: targetImage.alt,
                purpose: targetImage.purpose,
                filename: targetImage.filename,
                mimeType: targetImage.mimeType,
                width: targetImage.width,
                height: targetImage.height,
                squareSvg: squareSvgId,
                cardSvg: cardSvgId,
                focusX: targetImage.focusX,
                focusY: targetImage.focusY,
                data: fileData.toString('base64'),
                hash: fileHash,
                guid: targetImage.guid,
              }
              imageMap.set(targetImage.id, fileMeta)
            } catch (e) {
              payload.logger.error(`Error while saving ${targetImage.filename}.`)
              targetImageId = null
            }
          }

          // Simplify the reference.
          linkTile.linkTile.backgroundImage = targetImageId
        }
        if(linkTile.linkTile.type == "custom") {
          // Clear the inactive types
          linkTile.linkTile.reference = null
          linkTile.linkTile.linkedMedia = null
        }
        else if(linkTile.linkTile.type == "reference") {
          // Clear the inactive type
          linkTile.linkTile.linkedMedia = null

          if(linkTile.linkTile.reference && linkTile.linkTile.reference.relationTo === "pages" && linkTile.linkTile.reference.value) {
            const pageReference = linkTile.linkTile.reference.value
            const pagesMeta = {
              id: pageReference.id,
              title: pageReference.title,
              slug: pageReference.slug,
            }
            pagesMap.set(pageReference.id, pagesMeta)
            linkTile.linkTile.reference = pageReference.id;
          }
          else {
            linkTile.linkTile.reference = null
          }
        }
        else if(linkTile.linkTile.type == "mediaReference") {
          // Clear the inactive type
          linkTile.linkTile.reference = null

          if (linkTile?.linkTile?.linkedMedia) {
            let targetFile = linkTile?.linkTile?.linkedMedia
            let targetFileId = targetFile.id
            if (!imageMap.has(targetFile.id)) {
              let filePath = 'public/upload/media/' + targetFile.filename
              let fileData = readFileSync(filePath)
              let fileHash = createHash('sha1').update(fileData).digest('hex')
              let fileMeta = {
                id: targetFile.id,
                filename: targetFile.filename,
                mimeType: targetFile.mimeType,
                alt: targetFile.alt,
                caption: JSON.stringify(targetFile.caption),
                data: fileData.toString('base64'),
                hash: fileHash,
                guid: targetFile.guid,
              }
              mediaMap.set(targetFile.id, fileMeta)
            }
            linkTile.linkTile.linkedMedia = targetFileId
          }
        }
      })
    }
  })

  targetPage = await payload.findByID({
    collection: 'pages',
    id: targetId,
    depth: 0,
  })

  let outputObj = {
    imageSvgs: Object.fromEntries(imageSvgMap),
    images: Object.fromEntries(imageMap),
    media: Object.fromEntries(mediaMap),
    refPages: Object.fromEntries(pagesMap),
    page: targetPage,
  }

  let outputStr = TOML.stringify(outputObj)

  writeFileSync(targetFilename, outputStr)

  return
}
await backupPage(targetId, targetFilename)
exit()
