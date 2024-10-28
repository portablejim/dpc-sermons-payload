
import React, { Suspense, use } from 'react'
import type { Episode } from '@/payload-types'
import { Spinner } from '@nextui-org/react'
import { EpisodeGroupList } from '../EpisodeGroupList'

type Result = {
  docs: (Episode | string)[]
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: number
  page: number
  prevPage: number
  totalDocs: number
  totalPages: number
}

export type Props = {
  episodeType?: string
  initialEpisodeList?: Episode[],
  yearListPromise?: Promise<string[]>,
  onResultChange?: (result: Result) => void // eslint-disable-line no-unused-vars
}

export type MoreEpisodesProps = {
  baseUrl: string
  episodeType: string
  episodeYearListPromise: Promise<string[]>,
}

const MoreEpisodeList: React.FC<MoreEpisodesProps> = props => {
  const { baseUrl, episodeType, episodeYearListPromise } = props

    const episodeYearList = use(episodeYearListPromise)

    return (<>{episodeYearList.map(year => {
        let yearRssUrl = `${baseUrl}/podcast/${episodeType}/${year}.rss`
        const yearTitle = year

        return (<EpisodeGroupList title={year} rssUrl={yearRssUrl} episodeType={episodeType} episodeRange={year} defaultOpen={true} />)
  })}</>)
}

export const EpisodeGroupsList: React.FC<Props> = props => {
  const { episodeType = 'regular', initialEpisodeList = [], yearListPromise = Promise.resolve([]) } = props

  const baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL!

  let latestRssUrl = `${baseUrl}/podcast/`



  return (
    <div>
        <EpisodeGroupList title='Latest' rssUrl={latestRssUrl} episodeType={episodeType} episodeRange='latest' defaultOpen={true} initialEpisodeList={initialEpisodeList} />
        <Suspense fallback={<Spinner />}>
          <MoreEpisodeList baseUrl={baseUrl} episodeType={episodeType} episodeYearListPromise={yearListPromise} />
        </Suspense>
    </div>
  )
}
