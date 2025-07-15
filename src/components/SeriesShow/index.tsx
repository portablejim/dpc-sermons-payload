'use client'

import React from 'react'

import type { Series } from '@/payload-types'
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

export type Props = {
  targetSeries: Series
  className?: string
  limit?: number
  onResultChange?: (result: Result) => void
  showPageRange?: boolean
  sort?: string
  fallbackSvg: string
  fallbackPng: string
}

export const SeriesShow: React.FC<Props> = (props) => {
  const { targetSeries, fallbackSvg, fallbackPng } = props

  return (
    <div>
      <h1 className={classes.heading}>{targetSeries.title}</h1>
      <p className={classes.subheading}>
        <em>{targetSeries.subtitle}</em>
      </p>
      <ul className={classes.seriesList}>
        {targetSeries.episodes?.docs?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return (
              <div className={classes.column} key={index}>
                <li>
                  <EpisodeRow
                    doc={result}
                    paramSeries={targetSeries}
                    fallbackSvg={fallbackSvg}
                    fallbackPng={fallbackPng}
                  />
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
