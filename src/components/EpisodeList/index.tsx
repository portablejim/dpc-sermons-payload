import React, { Fragment, useEffect, useRef, useState } from 'react'

import configPromise from '@payload-config'
import type { Episode, Page } from '@/payload-types'
import { EpisodeRow } from '../EpisodeRow'

import classes from './index.module.scss'
import { getPayloadHMR } from '@payloadcms/next/utilities'

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
  className?: string
  limit?: number
  onResultChange?: (result: Result) => void // eslint-disable-line no-unused-vars
  showPageRange?: boolean
  sort?: string
}

export const EpisodeList: React.FC<Props> = async props => {
  const { className, limit = 10, onResultChange, showPageRange, sort = '-createdAt' } = props

  //const payload = await getPayloadHMR({ config: configPromise })

  const fetchedEpisodes = {docs: null}; /*await payload.find({
    collection: 'episodes',
    depth: 3,
    limit,
    where: {
      sermonDate: {
        greater_than: '2024-01-01',
      },
    },
  })*/

  return (
    <div>
      <ul>
        {fetchedEpisodes.docs?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return (
              <div className={classes.column} key={index}>
                <li>
                  <EpisodeRow doc={result} mediaType="video" />
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
