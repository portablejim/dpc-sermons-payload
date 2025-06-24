'use client'

import React, { useEffect, useRef, useState } from 'react'
import qs from 'qs'

import type { Episode } from '@/payload-types'
import { EpisodeRow } from '../EpisodeRow'

import classes from './index.module.scss'
import { Spinner } from "@heroui/react"

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
  fallbackSvg: string
  fallbackPng: string
}

export const EpisodeList: React.FC<Props> = (props) => {
  const {
    className,
    limit = 10,
    onResultChange,
    showPageRange,
    sort = '-createdAt',
    fallbackSvg,
    fallbackPng,
  } = props

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
          sort: '-sermonDate',
          where: {},
        },
        { encode: false },
      )

      const makeRequest = async () => {
        try {
          const req = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/episodes?${searchQuery}`,
          )

          const json = await req.json()
          if (timer != null) {
            clearTimeout(timer)
          }

          const { docs } = json as { docs: Episode[] }

          if (docs && Array.isArray(docs)) {
            setResults(json)
            setIsLoading(false)
            if (typeof onResultChange === 'function') {
              onResultChange(json)
            }
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
  }, [page, onResultChange])

  return (
    <div>
      {isLoading ? <Spinner /> : <></>}
      <ul>
        {results.docs?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return (
              <div className={classes.column} key={index}>
                <li>
                  <EpisodeRow doc={result} fallbackSvg={fallbackSvg} fallbackPng={fallbackPng} />
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
