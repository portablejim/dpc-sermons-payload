import payload, { getPayload } from 'payload'
import config from '@payload-config'
import { exit } from 'process'
import { spawn, execFile, execFileSync } from 'child_process'

// Running: pnpm run payload run scripts/page_restore.js 4 membershub.toml

import TOML from '@iarna/toml'
import fs, { readFileSync, writeFileSync } from 'fs'
import { createHash } from 'crypto'

let targetId = process.argv[2]
let targetFilename = process.argv[3]

const findExistingImage = async (payload, bgImgOldObject) => {
  const bgOldHash = bgImgOldObject.hash
  const bgNewById = await payload.findByID({
    collection: 'cover-images',
    id: bgImgOldId,
  })
  if(bgNewById && bgNewById.filename === bgImgOldObject.filename && bgNewById.mimeType === bgImgOldObject.mimeType) {
    return bgNewById.id
  }
  else {
    
  }

}

const restorePage = async (targetId, targetFilename) => {
  const restoreFileStr = fs.readFileSync(targetFilename)
  const restoreFileToml = TOML.parse(restoreFileStr)
  console.log(Object.entries(restoreFileToml.media))
  let mediaMap = new Map()
  Object.entries(restoreFileToml.media).forEach(([key, value]) => {
    mediaMap.set(key, value)
  })
  const mediaIdMap = new Map()

  restoreFileToml.page.layout.forEach((layout) => {
    if(layout.blockType === "linkTileList")
    {
      layout.linkTiles.forEach((linkTile) => {
        const bgImgOldId = linkTile.linktile.backgroundImage
        const bgImgOldObject = mediaMap.get(backgroundImageOldId)
        if(bgImgOldObject) {
          const existingImage = findExistingImage(payload, bgImgOldObject)
        }
        console.log({ linkTile })
      })
    }
  })
  //console.log(restoreFileToml.page.layout)

}
await restorePage(targetId, targetFilename)
exit()
