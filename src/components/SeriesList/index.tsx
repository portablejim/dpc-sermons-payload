'use client'

import React, { Fragment, use, useEffect, useRef, useState } from 'react'
import qs from 'qs'

import type { Page, Series } from '@/payload-types'
import { CardSeries } from '../../components/CardSeries'

import classes from './index.module.scss'

export const getSeriesList = (seriesType: string): Promise<any> => {
  const searchQuery = qs.stringify(
    {
      depth: 1,
      sort: '-seriesDate',
      where: {
        seriesType: {
          equals: seriesType,
        },
      },
      limit: 0,
    },
    { encode: false },
  )

  return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/series?${searchQuery}`, {
    next: {
      revalidate: 300,
    },
  })
    .then((r) => r.json())
    .catch(() => {
      return {
        docs: [],
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: 1,
        page: 1,
        prevPage: 1,
        totalDocs: 0,
        totalPages: 1,
      }
    })
}

export const SeriesListPreload: React.FC<Props> = (props) => {
  const { episodeType = 'regular' } = props
  getSeriesList(episodeType)
  return <></>
}

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
  seriesListPromise?: Promise<Response>
}

export const SeriesList: React.FC<Props> = (props) => {
  const { className, episodeType = 'regular' } = props

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasHydrated = useRef(false)
  const isRequesting = useRef(false)
  const [page, setPage] = useState(1)

  const [results, setResults] = useState<Result>({
    docs: [],
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: 1,
    page: 1,
    prevPage: 1,
    totalDocs: 0,
    totalPages: 1,
  })

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (!isRequesting.current) {
      isRequesting.current = true

      // hydrate the block with fresh content after first render
      // don't show loader unless the request takes longer than x ms
      // and don't show it during initial hydration
      timer = setTimeout(() => {
        if (hasHydrated.current) {
          setIsLoading(true)
        }
      }, 500)

      const searchQuery = qs.stringify(
        {
          depth: 1,
          page,
          sort: '-seriesDate',
          where: {},
          limit: 0,
        },
        { encode: false },
      )

      const makeRequest = async () => {
        try {
          const json = await getSeriesList(episodeType)
          if (timer != null) {
            clearTimeout(timer)
          }

          const { docs } = json as { docs: Series[] }

          if (docs && Array.isArray(docs)) {
            setResults(json)
            setIsLoading(false)
          }
        } catch (err) {
          console.warn(err) // eslint-disable-line no-console
          setIsLoading(false)
          setError(`Unable to load "series" data at this time.`)
        }

        isRequesting.current = false
        hasHydrated.current = true
      }

      void makeRequest()
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [episodeType, page])

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
