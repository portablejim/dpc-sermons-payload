import React, { Fragment } from 'react'

import type { Episode, Series } from '@/payload-types'
import { SeriesList } from '../../components/SeriesList'

import classes from './index.module.scss'
import { EpisodeGroupsList } from '@/components/EpisodeGroupsList'
import { LibraryList as LibraryListComponent } from '@/components/LibraryList'

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
  limit?: number
  onResultChange?: (result: Result) => void // eslint-disable-line no-unused-vars
  showPageRange?: boolean
  sort?: string
}

export const LibraryList: React.FC<Props> = async props => {
  const { className } = props

  const yearListPromise = (async () => {
    let timestamp = new Date()
    let yearsToRemove = [timestamp.getFullYear().toFixed(0)]
    if (timestamp.getMonth() < 7) {
      yearsToRemove.push((timestamp.getFullYear() - 1).toFixed(0))
    }
    let yearsRaw = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/episodes/yearList/regular`)
    let yearsJson = (await yearsRaw.json()) as string[]
    if(yearsJson && Array.isArray(yearsJson)) {
      return yearsJson.filter(y => !yearsToRemove.includes(y))
    } else {
      return []
    }
  })()

  const latestEpisodesRaw = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/episodes/byYear/regular/latest`)
  const latestEpisodesJson = (await latestEpisodesRaw.json()) as Episode[]

  let latestEpisodes: Episode[] = []
  if (latestEpisodesJson && Array.isArray(latestEpisodesJson)) {
    latestEpisodes = latestEpisodesJson
  }

  return (
    <div className={[classes.collectionArchive, className].filter(Boolean).join(' ')}>
      <Fragment>
          <div className='container flex flex-col justify-between'>
            <LibraryListComponent byDateTab={(
              <div className="episodeListContainer">
                <EpisodeGroupsList initialEpisodeList={latestEpisodes} yearListPromise={yearListPromise} />
              </div>
            )}
            bySeriesTab = {(
              <SeriesList />
            )}
            byPassageTab = {(
              <p>Bible books</p>
            )}
             />
          </div>
      </Fragment>
    </div>
  )
}
