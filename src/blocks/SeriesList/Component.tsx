'use client'

import React, { Fragment, useRef, useState } from 'react'

import type { Series } from '@/payload-types'
import { SeriesList as SeriesListComponent } from '../../components/SeriesList'

import classes from './index.module.scss'
import { Gutter } from '@payloadcms/ui/elements/Gutter'

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
  onResultChange?: (result: Result) => void  
  showPageRange?: boolean
  sort?: string
}

export const SeriesList: React.FC<Props> = props => {
  const { className, limit = 10, onResultChange, showPageRange, sort = '-createdAt' } = props

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className={[classes.collectionArchive, className].filter(Boolean).join(' ')}>
      <div className={classes.scrollRef} ref={scrollRef} />
      {!isLoading && error && <Gutter>{error}</Gutter>}
      <Fragment>
        <Gutter>
          <SeriesListComponent />
        </Gutter>
      </Fragment>
    </div>
  )
}
