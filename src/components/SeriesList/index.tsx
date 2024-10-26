'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'

import type { Page, Series } from '@/payload-types'
import { CardSeries } from '../../components/CardSeries'

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
  className?: string
  limit?: number
  onResultChange?: (result: Result) => void // eslint-disable-line no-unused-vars
  showPageRange?: boolean
  sort?: string
}

export const SeriesList: React.FC<Props> = props => {
  const { className, limit = 10, onResultChange, showPageRange, sort = '-createdAt' } = props

  let results = {docs: []}

  return (
    <div className={classes.grid}>
      {results.docs?.map((result, index) => {
        if (typeof result === 'object' && result !== null) {
          return (
            <div className={classes.column} key={index}>
              <CardSeries doc={result} mediaType="video" />
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
