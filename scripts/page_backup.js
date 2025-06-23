import { getPayload } from 'payload'
import config from '@payload-config'
import { exit } from 'process'
import { spawn, execFile, execFileSync } from 'child_process'

// Running: pnpm run payload run scripts/page_backup.js 4 membershub.toml

import TOML from '@iarna/toml'

let targetId = process.argv[2]
let targetFilename = process.argv[3]

console.log({ targetId, targetFilename })
const backupPage = async (targetId, targetFilename) => {
  const payload = await getPayload({ config })

  console.log({ targetId })
  let targetPage = payload.findByID({
    colletion: 'pages',
    id: targetId,
  })

  let mediaSet = new Set()

  console.log(targetPage.layout)
}
await backupPage(targetId, targetFilename)
