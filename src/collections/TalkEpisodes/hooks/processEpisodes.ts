import { AfterChangeHook } from 'node_modules/payload/dist/collections/config/types'

import { Episode } from '@/payload-types'
import * as os from 'node:os'
import path from 'path'
import fs from 'fs'
import * as child_process from 'node:child_process'
import { isValidHttpUrl } from '@/utilities/isValidHttpUrl'
import { revalidateEpisode } from '@/collections/TalkEpisodes/hooks/revalidateEpisode'

export type EpisodeMetadata = {
  fileType: string
  fileSize: number
  audioLength: number
}

export const fetchEpisodeMetadata = async (
  ep: Episode,
  tempDir: string,
): Promise<EpisodeMetadata | null> => {
  if (
    ep.audioFormat == 'linked' &&
    ((ep.linkedAudioFiletype &&
      ep.linkedAudioFiletype.length > 1 &&
      ep.linkedAudioFileSize &&
      ep.linkedAudioFileSize > 0 &&
      ep.linkedAudioLength &&
      ep.linkedAudioLength > 0) ||
      !isValidHttpUrl(ep.linkedAudioUrl))
  ) {
    return null
  }

  if (ep.linkedAudioUrl !== null && ep.linkedAudioUrl !== undefined) {
    const audioDataResponse = await fetch(ep.linkedAudioUrl)
    if (!audioDataResponse.ok) {
      return null
    }

    const audioDataBlob = await audioDataResponse.blob()
    const audioData = await audioDataBlob.arrayBuffer()
    const audioDataFilename = crypto.randomUUID()
    const audioDataPath = path.join(tempDir, audioDataFilename)
    if (audioData === null) {
      return null
    }
    try {
      fs.writeFileSync(audioDataPath, Buffer.from(audioData))
      const lengthOutput = child_process.execFile('ffprobe', [
        '-v',
        'error',
        '-show-entries',
        'format=duration',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        audioDataPath,
      ])
      const fileType = audioDataResponse.headers.get('Content-Type') ?? ''
      const fileSize = audioData.byteLength
      let audioLength = 0
      if (lengthOutput.stdout !== null) {
        audioLength = parseFloat(lengthOutput.stdout.toString())
      }
      return { fileType, fileSize, audioLength }
    } catch (e) {
      return null
    } finally {
      fs.unlink(audioDataPath, () => {})
    }
  }
  //return { fileType: ep.linkedAudioFiletype ?? null, fileSize: ep.linkedAudioFileSize ?? null, audioLength: ep.linkedAudioLength ?? null}
  return null
}
// Revalidate the post in the background, so the user doesn't have to wait
// Notice that the hook itself is not async and we are not awaiting `revalidate`
export const processEpisodes: AfterChangeHook = (inputArgs) => {
  const doc = inputArgs.doc
  const payload = inputArgs.req.payload
  if (doc.linkedAudioUrl && doc.linkedAudioUrl?.length > 1) {
    const tempDir = os.tmpdir()
    payload
      .find({
        collection: 'episodes',
        where: {
          hasValidMedia: {
            equals: false,
          },
          audioFormat: {
            equals: 'linked',
          },
        },
      })
      .then((oldEpisodesResponse) => {
        oldEpisodesResponse.docs.map(async (ep) => {
          const outputEpisode = await fetchEpisodeMetadata(ep, tempDir)
          if (outputEpisode != null) {
            await payload.update({
              collection: 'episodes',
              id: ep.id,
              data: {
                linkedAudioFiletype: outputEpisode.fileType,
                linkedAudioFileSize: outputEpisode.fileSize,
                linkedAudioLength: outputEpisode.audioLength,
              },
            })
          }
        })
        revalidateEpisode(inputArgs)
      })
  }

  return doc
}

export const processEpisode: AfterChangeHook = (inputArgs) => {
  const doc = inputArgs.doc
  const payload = inputArgs.req.payload
  if (doc.linkedAudioUrl && doc.linkedAudioUrl?.length > 1) {
    const tempDir = os.tmpdir()
    fetchEpisodeMetadata(doc, tempDir).then(async (outputEpisode) => {
      if (outputEpisode != null) {
        await payload.update({
          collection: 'episodes',
          id: doc.id,
          data: {
            linkedAudioFiletype: outputEpisode.fileType,
            linkedAudioFileSize: outputEpisode.fileSize,
            linkedAudioLength: outputEpisode.audioLength,
          },
        })
      }
      revalidateEpisode(inputArgs)
    })
  }

  return doc
}
