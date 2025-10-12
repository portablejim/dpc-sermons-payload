'use client'

import React, { useEffect, useRef, useState } from 'react'


import { BooksGroupList } from '../BooksGroupList'
import * as Accordion from '@radix-ui/react-accordion'

export const getBooksList = (episodeType: string): Promise<BooksResult[]> => {
  return fetch(`${process.env.APP_RELATIVE_URL ?? ''}/api/episodes/bookList/${episodeType}`, {
    next: {
      revalidate: 600,
    },
  })
    .then((r) => r.json())
    .catch(() => {
      return []
    })
}

export type BookListPreloadProps = {
  episodeType: string
}

export const BooksListPreload: React.FC<BookListPreloadProps> = (props) => {
  const { episodeType = 'regular' } = props
  // This is a preload, so not using the result is fine.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const booksListRef = useRef(getBooksList(episodeType))
  return <></>
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
  fallbackSvg: string
  fallbackPng: string
}

export const BooksGroupsList: React.FC<Props> = (props) => {
  const { episodeType = 'regular', fallbackSvg, fallbackPng } = props

  const [, setIsLoading] = useState(false)
  const [, setError] = useState<string | undefined>(undefined)
  const hasHydrated = useRef(false)
  const isRequesting = useRef(false)
  const [page] = useState(1)

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
          console.warn(err)
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
                fallbackSvg={fallbackSvg}
                fallbackPng={fallbackPng}
              />
            )
          }

          return null
        })}
      </Accordion.Root>
    </div>
  )
}
