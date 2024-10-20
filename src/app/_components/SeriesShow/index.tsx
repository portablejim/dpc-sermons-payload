'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'
import qs from 'qs'

import type { CoverImage, Episode, Page, Series } from '../../../payload/payload-types'
import { Image } from '../../_components/Media/Image'
import { CardSeries } from '../CardSeries'
import { Gutter } from '../Gutter'

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
      <h1>{targetSeries.title}</h1>
      <p>
        <em>{targetSeries.subtitle}</em>
      </p>
      <div className={classes.grid}>
        {targetSeries.episodes?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return (
              <div className={classes.column} key={index}>
                <p>{result.title}</p>
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
