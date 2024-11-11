'use server'
import { statSync, openSync, fstat } from 'fs'

export const getStaticFile = async (fileName: string) => {
  let basePathName = process.env.APP_PUBLIC__DIR_PATH + '/static'
  let baseUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/static`

  let fStat = statSync(`${basePathName}/${fileName}`)
  let fstatMtime = fStat.mtime.getTime()

  return `${baseUrl}/${fileName}`
}
