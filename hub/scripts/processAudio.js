import { getPayload } from 'payload'
import config from '@payload-config'
import { exit } from 'process'
import { spawn, execFile, execFileSync } from 'child_process'

const processAudio = async () => {
  const payload = await getPayload({ config })

  let audioFiles = await payload.find({
    collection: 'talk-audio',
    where: {
      status: {
        equals: 'initial',
      },
    },
  })

  let outputFormats = [
    {
      suffix: 'high',
    },
  ]

  const runFFmpeg = (ffmpegArgs) =>
    new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ffmpegArgs)
      let output = ''
      ffmpeg.stderr.on('data', (c) => {
        output += c
      })

      ffmpeg.on('exit', (code) => {
        if (code) {
          reject({ code: code, message: output })
        } else {
          resolve(output)
        }
      })
    })

  const convertToMp3 = (filePath) =>
    new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ['-i', filePath, '-y', 'testing2.mp3'])
      let output = ''
      ffmpeg.stderr.on('data', (c) => {
        output += c
      })

      ffmpeg.on('exit', (code) => {
        if (code) {
          reject({ code: code, message: output })
        } else {
          resolve(output)
        }
      })
    })

  for (let i = 0; i < audioFiles.docs.length; i++) {
    let audioFile = audioFiles.docs[i]
    console.log(JSON.stringify(audioFile))
    /*
    let processedFile = await execFileSync(
      'ffmpeg',
      ['-y', '-i', 'public/upload/talkaudio/' + audioFile.filename, 'testing.mp3'],
      { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 100 * 1024 * 1024 },
    )
      */
    let processedFile = await convertToMp3('public/upload/talkaudio/' + audioFile.filename)
    console.log({ processedFile: processedFile.toString() })
    break
    //console.log(JSON.stringify(processedFile))
  }

  console.log('Testing')
}

await processAudio()

exit()
