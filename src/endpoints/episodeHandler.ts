import { desc, eq } from 'drizzle-orm'
import { BasePayload, type PayloadHandler } from 'payload'
import { Episode } from '@/payload-types'

export const validYears: PayloadHandler = async (req): Promise<Response> => {
  const { payload, routeParams } = req

  const episodeType: string = (routeParams?.type as string) ?? ''
  const output = validYearsInternal(payload, episodeType)

  return Response.json(output)
}

export const validYearsInternal = async (
  payload: BasePayload,
  episodeType: string,
): Promise<string[]> => {
  const episodesTable = payload.db.tables.episodes
  const yearSelect = await payload.db.drizzle
    .selectDistinct({ year: episodesTable.sermonDateYear })
    .from(episodesTable)
    .where(eq(episodesTable.episodeType, episodeType))
    .orderBy(desc(episodesTable.sermonDateYear))

  return yearSelect.filter((ys) => typeof ys.year === 'string').map((ys) => ys.year as string)
}

export const episodeList: PayloadHandler = async (req): Promise<Response> => {
  const { payload, routeParams } = req

  const currentRange = <string | undefined>routeParams?.year ?? 'latest'
  const episodeType = <string | undefined>routeParams?.type ?? ''

  const episodeList = await episodeListInternal(payload, currentRange, episodeType)
  return Response.json(episodeList.data, episodeList.init)
}

export const episodeListInternal = async (payload: BasePayload, currentRange: string, episodeType: string): Promise<{data: Episode[], init: ResponseInit | undefined}> => {
  if (currentRange === 'all') {
    const episodeFind = await payload.find({
      collection: 'episodes',
      where: {
        episodeType: {
          equals: episodeType,
        },
      },
      depth: 2,
      sort: '-sermonDate',
      limit: 0,
    })
    return {data: episodeFind.docs, init: undefined}
  } else {
    let validYears: number[] = []
    if (currentRange === 'latest') {
      const timestamp = new Date()
      validYears = [timestamp.getFullYear()]
      if (timestamp.getMonth() < 7) {
        validYears.push(timestamp.getFullYear() - 1)
      }
    } else {
      const parsedRange = parseInt(currentRange)
      if (isNaN(parsedRange)) {
        return {
          data: [],
          init: {
              status: 404,
              statusText: 'Year not found',
            },
        }
      }
      validYears.push(parsedRange)
    }

    const episodeFind = await payload.find({
      collection: 'episodes',
      where: {
        and: [
          {
            episodeType: {
              equals: episodeType,
            },
          },
          {
            sermonDateYear: {
              in: validYears,
            },
          },
        ],
      },
      depth: 3,
      sort: '-sermonDate',
      limit: 0,
    })
    return {data: episodeFind.docs, init: undefined }
  }

}
