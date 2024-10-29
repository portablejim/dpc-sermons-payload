'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'
import qs from 'qs'

import configPromise from '@payload-config'
import type { Episode, Page, Series } from '@/payload-types'
import { EpisodeRow } from '../EpisodeRow'

import classes from './index.module.scss'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { Spinner } from '@nextui-org/react'

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
  title: string,
  rssUrl: string | undefined,
  episodeType: string,
  episodeRange: string,
  defaultOpen: boolean,
  initialEpisodeList?: Episode[]
  onResultChange?: (result: Result) => void // eslint-disable-line no-unused-vars
}

export const EpisodeGroupList: React.FC<Props> = props => {
  const { title, rssUrl, episodeType, episodeRange, defaultOpen, initialEpisodeList = [], onResultChange } = props

  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [error, setError] = useState<string | undefined>(undefined)
  const hasHydrated = useRef(false)
  const isRequesting = useRef(false)
  const [page, setPage] = useState(1)

  const [results, setResults] = useState<Episode[]>(initialEpisodeList)

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
        if(isOpen)
        {
          try {
            const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/episodes/byYear/${episodeType}/${episodeRange}`)

            const json = await req.json() as Episode[]
            if(timer != null) {
              clearTimeout(timer)
            }

            if (json && Array.isArray(json)) {
              setResults(json)
              setIsLoading(false)
              /*
              if (typeof onResultChange === 'function') {
                onResultChange(json)
              }
              */
            }
          } catch (err) {
            console.warn(err) // eslint-disable-line no-console
            setIsLoading(false)
            setError(`Unable to load "series" data at this time.`)
          }

        isRequesting.current = false
        hasHydrated.current = true
        }
      }

      void makeRequest()
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [episodeType, episodeRange, isOpen])

  return (
    <div>
        <hr />
        <h3>{title}</h3>
        <p><a href={rssUrl}>RSS</a></p>
        {isLoading ? (<Spinner />) : <></>}
      <ul>
        {results.map((result, index) => {
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
        <hr />
    </div>
  )
}
