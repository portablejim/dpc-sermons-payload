'use client'

import React, { Fragment, use, useEffect, useRef, useState } from 'react'
import qs from 'qs'

import type { Page, Series } from '@/payload-types'
import { CardSeries } from '../CardSeries'

import classes from './index.module.scss'
import { BooksGroupList } from '../BooksGroupList'
import * as Accordion from '@radix-ui/react-accordion'

export const getBooksList = (episodeType: string): Promise<BooksResult[]> => {
  return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/episodes/bookList/${episodeType}`, {
    cache: 'default',
    next: {
      revalidate: 600,
    },
  })
    .then((r) => r.json())
    .catch(() => {
      return []
    })
}

export const BooksListPreload: React.FC<Props> = (props) => {
  const { episodeType = 'regular' } = props
  getBooksList(episodeType)
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

type BooksResult = {
  book: string
  bookName: string
  slug: string
}

export type Props = {
  className?: string
  episodeType?: string
  seriesListPromise?: Promise<Response>
}

export const BooksGroupsList: React.FC<Props> = (props) => {
  const { className, episodeType = 'regular' } = props

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasHydrated = useRef(false)
  const isRequesting = useRef(false)
  const [page, setPage] = useState(1)

  const [results, setResults] = useState<BooksResult[]>([])

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
          const json = await getBooksList(episodeType)
          if (timer != null) {
            clearTimeout(timer)
          }

          const docs = json as BooksResult[]

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

  const initialAccordionState: string[] = []
  const [accordionState, setAccordionState] = useState(initialAccordionState)

  return (
    <div className="">
      <Accordion.Root
        className="accordionRoot"
        type="multiple"
        value={accordionState}
        onValueChange={setAccordionState}
      >
        {results?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return (
              <BooksGroupList
                key={index}
                title={result.bookName}
                episodeType={episodeType}
                episodeRange={result.book}
                accordionsOpen={accordionState}
              />
            )
          }

          return null
        })}
      </Accordion.Root>
    </div>
  )
}
