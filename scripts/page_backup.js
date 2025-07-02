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
  })

  let imageMap = new Map()
  let mediaMap = new Map()

  targetPage.layout.forEach((layoutInstance) => {
    if (layoutInstance.blockType == 'linkTileList' && layoutInstance.linkTiles) {
      layoutInstance.linkTiles.forEach((linkTile) => {
        if (linkTile?.linkTile?.backgroundImage) {
          let targetImage = linkTile?.linkTile?.backgroundImage
          if (!imageMap.has(targetImage.id)) {
            let filePath = 'public/cover-images/' + targetImage.filename
            let fileData = readFileSync(filePath)
            let fileHash = createHash('sha1').update(fileData).digest('hex')
            let fileMeta = {
              id: targetImage.id,
              filename: targetImage.filename,
              mimeType: targetImage.mimeType,
              focusX: targetImage.focusX,
              focusY: targetImage.focusY,
              alt: targetImage.alt,
              caption: targetImage.caption,
              data: fileData.toString('base64'),
              hash: fileHash,
            }
            imageMap.set(targetImage.id, fileMeta)
          }
        }
        if (linkTile?.linkTile?.linkedMedia) {
          let targetFile = linkTile?.linkTile?.linkedMedia
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
            }
            mediaMap.set(targetFile.id, fileMeta)
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
    images: Object.fromEntries(imageMap),
    media: Object.fromEntries(mediaMap),
    page: targetPage,
  }

  let outputStr = TOML.stringify(outputObj)

  writeFileSync(targetFilename, outputStr)

  return
}
await backupPage(targetId, targetFilename)
exit()
