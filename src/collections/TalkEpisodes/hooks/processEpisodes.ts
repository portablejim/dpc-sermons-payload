import { AfterChangeHook } from 'node_modules/payload/dist/collections/config/types'

import { Episode } from '@/payload-types'
import * as os from 'node:os'
import path from 'path'
import fs from 'fs'
import * as child_process from 'node:child_process'
import { isValidHttpUrl } from '@/utilities/isValidHttpUrl'
import {
  revalidateEpisode,
  revalidateEpisodeRaw,
} from '@/collections/TalkEpisodes/hooks/revalidateEpisode'
import { BasePayload } from 'payload'
import { text } from 'node:stream/consumers'

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
    ep.audioFormat === 'linked' &&
    ((ep.linkedAudioFiletype &&
      ep.linkedAudioFiletype.length > 1 &&
      ep.linkedAudioFileSize &&
      ep.linkedAudioFileSize > 0 &&
      ep.linkedAudioLength &&
      ep.linkedAudioLength > 0) ||
      !isValidHttpUrl(ep.linkedAudioUrl))
  ) {
    // Just return null to stop an update when it is already set.
    return null
  }

  if (ep.audioFormat == 'linked' && ep.linkedAudioUrl !== null && ep.linkedAudioUrl !== undefined) {
    const audioDataResponse = await fetch(ep.linkedAudioUrl)
    if (!audioDataResponse.ok) {
      console.log('Response not ok')
      return null
    }

    const audioDataBlob = await audioDataResponse.blob()
    const audioData = await audioDataBlob.arrayBuffer()
    const audioDataFilename = 'ffprobe-' + crypto.randomUUID()
    const audioDataPath = path.join(tempDir, audioDataFilename)
    if (audioData === null) {
      console.log('No audio data')
      return null
    }
    try {
      fs.writeFileSync(audioDataPath, Buffer.from(audioData))
      const lengthOutput = child_process.execFileSync(
        'ffprobe',
        [
          '-v',
          'error',
          '-show_entries',
          'format=duration',
          '-of',
          'default=noprint_wrappers=1:nokey=1',
          audioDataPath,
        ],
        {
          stdio: 'pipe',
        },
      )
      const formatOutput = child_process.execFileSync('file', ['--mime-type', audioDataPath], {
        stdio: 'pipe',
      })
      const fileTypeParts = formatOutput.toString('utf-8').split(' ')
      const fileType =
        fileTypeParts.length > 0 ? fileTypeParts[fileTypeParts.length - 1].trim() : fileTypeParts[0].trim()
      const fileSize = audioData.byteLength
      let audioLength = 0
      const lengthOutputStr = lengthOutput.toString('utf8')
      audioLength = parseFloat(lengthOutputStr)
      return { fileType, fileSize, audioLength }
    } catch (err) {
      if (err.code) {
        // Spawning child process failed
        console.error(err.code)
      } else {
        // Child was spawned but exited with non-zero exit code
        // Error contains any stdout and stderr from the child
        const { stdout, stderr } = err

        console.error({ stdout, stderr })
      }
      return null
    } finally {
      fs.unlink(audioDataPath, () => {})
    }
  }
  return null
}
// Revalidate the post in the background, so the user doesn't have to wait
// Notice that the hook itself is not async and we are not awaiting `revalidate`
export const processEpisodes: AfterChangeHook = (inputArgs) => {
  return processEpisodesRaw(inputArgs.req.payload)
}

export const processEpisodesRaw = (payload: BasePayload) => {
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
      if (oldEpisodesResponse.totalDocs > 0) {
        const currentDate = new Date().toISOString()
        console.log(
          currentDate + ': Episodes to process: ' + oldEpisodesResponse.totalDocs.toString(10),
        )
      }
      oldEpisodesResponse.docs.map(async (ep) => {
        const outputEpisode = await fetchEpisodeMetadata(ep, tempDir)
        console.log({ id: ep.id, ...outputEpisode })
        if (outputEpisode != null) {
          try {
            const baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL
            const episodeId = ep.id
            const API_KEY = process.env.INTEGRATION_API_KEY
            const req = await fetch(`${baseUrl}/api/episodes/${episodeId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `users API-Key ${API_KEY}`,
              },
              body: JSON.stringify({
                linkedAudioFiletype: outputEpisode.fileType,
                linkedAudioFileSize: outputEpisode.fileSize,
                linkedAudioLength: outputEpisode.audioLength,
              }),
            })
            const data = await req.json()
            console.log(data)
          } catch (err) {
            console.log(err)
          }
        }
      })
    })
}

export const processEpisode: AfterChangeHook = (inputArgs) => {
  const doc = inputArgs.doc
  const payload = inputArgs.req.payload
  console.log({op: inputArgs.operation})
  if (doc.hasValidMedia === false && doc.linkedAudioUrl && doc.linkedAudioUrl?.length > 1) {
    payload.logger.debug('Validating metadata')
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
      } else {
        revalidateEpisode(inputArgs)
      }
    })
  } else {
    revalidateEpisode(inputArgs)
  }

  return doc
}
