import { AfterChangeHook } from 'node_modules/payload/dist/collections/config/types'
import path from 'path'
import { fileURLToPath } from 'url'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

let ffmpeg = require('fluent-ffmpeg')

// Revalidate the post in the background, so the user doesn't have to wait
// Notice that the hook itself is not async and we are not awaiting `revalidate`
// Only revalidate existing docs that are published
// Don't scope to `operation` in order to purge static demo posts
export const getFileData: AfterChangeHook = ({ doc, previousDoc, req: { payload } }) => {
  if (doc._status === 'published') {
    //revalidate({ payload, collection: 'posts', slug: doc.slug })
  }
  //let payload = getPayload({ config })
  if (
    doc.filename == previousDoc.filename &&
    doc.filesize == previousDoc.filesize &&
    (doc.lengthSeconds != previousDoc.lengthSeconds ||
      doc.lengthSeconds != previousDoc.lengthDisplay)
  ) {
    return
  }
  const filename = fileURLToPath(import.meta.url)
  const dirname = path.dirname(filename)
  const targetFilename = path.resolve(dirname, '../../public/talkaudio', doc.filename)
  payload.logger.info(targetFilename)
  payload.logger.info({ doc, previousDoc })
  let ffprobeOutput = ffmpeg.ffprobe(targetFilename, function (err, metadata) {
    if (!err) {
      let fileDuration = parseInt(metadata.format.duration)
      if (isNaN(fileDuration)) {
        fileDuration = 0
      }
      doc.lengthSeconds = fileDuration
      doc.lengthDisplay = new Date(1514 * 1000).toUTCString().substring(17, 25)
      payload.logger.info({ lengeth: metadata.format.duration })

      payload
        .update({
          collection: 'talk-audio',
          id: doc.id,
          data: {
            lengthSeconds: doc.lengthSeconds,
            lengthDisplay: doc.lengthDisplay,
            guid: doc.guid,
          },
        })
        .then((output) => {
          payload.logger.info({ output })
        })
    } else {
      payload.logger.info('Error running ffprobe.')
      payload.logger.info({ err })
    }
  })

  return doc
}
