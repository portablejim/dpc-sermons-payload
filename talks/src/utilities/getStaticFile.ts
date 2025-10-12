import { statSync } from 'fs'

export const getStaticFile = (fileName: string) => {
  const basePathName = process.env.APP_PUBLIC__DIR_PATH + '/static'
  const baseUrl = `${process.env.APP_RELATIVE_URL ?? ''}/static`

  const fStat = statSync(`${basePathName}/${fileName}`)
  const fStatMTime = fStat.mtime.getTime()

  return `${baseUrl}/${fileName}?m=${fStatMTime}`
}
