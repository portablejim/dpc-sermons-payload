import React, { Fragment } from 'react'

import type { Episode, Series } from '@/payload-types'
import { SeriesList, SeriesListPreload } from '../../components/SeriesList'

import classes from './index.module.scss'
import { EpisodeGroupsList } from '@/components/EpisodeGroupsList'
import { LibraryList as LibraryListComponent } from '@/components/LibraryList'
import { BooksGroupsList, BooksListPreload } from '@/components/BooksGroupsList'
import { getStaticFile } from '@/utilities/getStaticFile'
import { episodeListInternal, validYearsInternal } from '@/endpoints/episodeHandler'
import payload, { getPayload } from 'payload'
import configPromise from '@payload-config'

type Result = {
  docs: (Series | string)[]
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: number
  page: number
  prevPage: number
  totalDocs: number
  totalPages: number
}

export type Props = {
  className?: string
  episodeType?: string
  limit?: number
  onResultChange?: (result: Result) => void
  showPageRange?: boolean
  sort?: string
}

export const LibraryList: React.FC<Props> = async (props) => {
  const { className, episodeType = 'regular' } = props

  const payload = await getPayload({ config: configPromise })

  const yearListPromise = (async () => {
    const timestamp = new Date()
    const yearsToRemove = [timestamp.getFullYear().toFixed(0)]
    if (timestamp.getMonth() < 7) {
      yearsToRemove.push((timestamp.getFullYear() - 1).toFixed(0))
    }

    const yearsJson = await validYearsInternal(payload, episodeType) as string[]
    if (yearsJson && Array.isArray(yearsJson)) {
      return yearsJson.filter((y) => !yearsToRemove.includes(y))
    } else {
      return []
    }
  })()

  const latestEpisodesJson = await episodeListInternal(payload, 'latest', episodeType).then(d => d.data)

  let latestEpisodes: Episode[] = []
  if (latestEpisodesJson && Array.isArray(latestEpisodesJson)) {
    latestEpisodes = latestEpisodesJson
  }

  const fallbackImageUrlSvg = getStaticFile('dpcPodcastGenericLogo_plain.svg')
  const fallbackImageUrlPng = getStaticFile('dpcPodcastGenericLogo_plain.png')

  return (
    <div className={[classes.collectionArchive, className].filter(Boolean).join(' ')}>
      <SeriesListPreload episodeType={episodeType} />
      <BooksListPreload episodeType={episodeType} />
      <Fragment>
        <div className="container flex flex-col justify-between">
          <LibraryListComponent
            byDateTab={
              <div className="episodeListContainer">
                <EpisodeGroupsList
                  initialEpisodeList={latestEpisodes}
                  episodeType={episodeType}
                  yearListPromise={yearListPromise}
                  fallbackPng={fallbackImageUrlPng}
                  fallbackSvg={fallbackImageUrlSvg}
                />
              </div>
            }
            bySeriesTab={<SeriesList episodeType={episodeType} />}
            byPassageTab={
              <BooksGroupsList
                episodeType={episodeType}
                fallbackPng={fallbackImageUrlPng}
                fallbackSvg={fallbackImageUrlSvg}
              />
            }
          />
        </div>
      </Fragment>
    </div>
  )
}
