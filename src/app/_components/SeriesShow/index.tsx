'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'

import type { CoverImage, Episode, Page, Series } from '../../../payload/payload-types'
import { Image } from '../../_components/Media/Image'
import { EpisodeRow } from '../EpisodeRow'

import classes from './index.module.scss'

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

let HeroImage = ({ seriesImage }: { seriesImage: number | CoverImage }): JSX.Element => {
  if (typeof seriesImage != 'number') {
    return (
      <>
        <Image resource={seriesImage} resourceType="coverImage" sizeType="card" />
      </>
    )
  }
  return <></>
}

export type Props = {
  targetSeries: Series & { episodes: Episode[] }
  className?: string
  limit?: number
  onResultChange?: (result: Result) => void // eslint-disable-line no-unused-vars
  showPageRange?: boolean
  sort?: string
}

export const SeriesShow: React.FC<Props> = props => {
  const { targetSeries, sort = '-createdAt' } = props

  return (
    <div>
      <h1 className={classes.heading}>{targetSeries.title}</h1>
      <p className={classes.subheading}>
        <em>{targetSeries.subtitle}</em>
      </p>
      <ul className={classes.seriesList}>
        {targetSeries.episodes?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return (
              <div className={classes.column} key={index}>
                <li>
                  <EpisodeRow doc={result} paramSeries={targetSeries} mediaType="video" />
                </li>
              </div>
            )
          }

          return null
        })}
      </ul>
    </div>
  )
}
