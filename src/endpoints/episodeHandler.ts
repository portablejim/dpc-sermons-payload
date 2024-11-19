import { desc, eq } from 'drizzle-orm/expressions'
import { type PayloadHandler } from 'payload'

export const validYears: PayloadHandler = async (req): Promise<Response> => {
  const { payload, routeParams } = req

  let episodeType = routeParams?.type ?? ''

  const episodesTable = payload.db.tables.episodes

  let yearSelect = await payload.db.drizzle
    .selectDistinct({ year: episodesTable.sermonDateYear })
    .from(episodesTable)
    .where(eq(episodesTable.episodeType, episodeType))
    .orderBy(desc(episodesTable.sermonDateYear))

  let output = yearSelect.filter((ys) => typeof ys.year === 'string').map((ys) => ys.year as string)

  return Response.json(output)
}

export const episodeList: PayloadHandler = async (req): Promise<Response> => {
  const { payload, routeParams } = req

  let currentRange = <string | undefined>routeParams?.year ?? 'latest'
  let episodeType = <string | undefined>routeParams?.type ?? ''

  if (currentRange === 'all') {
    let episodeFind = await payload.find({
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
    return Response.json(episodeFind.docs)
  } else {
    let validYears: number[] = []
    if (currentRange === 'latest') {
      let timestamp = new Date()
      validYears = [timestamp.getFullYear()]
      if (timestamp.getMonth() < 7) {
        validYears.push(timestamp.getFullYear() - 1)
      }
    } else {
      let parsedRange = parseInt(currentRange)
      if (isNaN(parsedRange)) {
        return Response.json(
          {},
          {
            status: 404,
            statusText: 'Year not found',
          },
        )
      }
      validYears.push(parsedRange)
    }

    let episodeFind = await payload.find({
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
    episodeFind.docs
    return Response.json(episodeFind.docs)
  }
}
