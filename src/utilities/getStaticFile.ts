import { statSync, openSync, fstat } from 'fs'
import path from 'path'

export const getStaticFile = (fileName: string) => {
  const basePathName = process.env.APP_PUBLIC__DIR_PATH + '/static'
  const baseUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/static`

  const fStat = statSync(`${basePathName}/${fileName}`)
  const fStatMTime = fStat.mtime.getTime()

  return `${baseUrl}/${fileName}?m=${fStatMTime}`
}
