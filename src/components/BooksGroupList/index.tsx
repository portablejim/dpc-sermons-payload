'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'

import type { Episode, Page, Series } from '@/payload-types'
import { EpisodeRow } from '../EpisodeRow'

import classes from './index.module.scss'
import { Spinner } from "@heroui/react"
import {
  ICON_SVG_MINUS,
  ICON_SVG_MINUS_REACT,
  ICON_SVG_PLUS,
  ICON_SVG_PLUS_REACT,
  ICON_SVG_PODCAST,
  ICON_SVG_PODCAST_REACT,
  ICON_SVG_REACT,
  svgToDataURI,
} from '@/utilities/iconsSvg'
import Image from 'next/image'
import * as Accordion from '@radix-ui/react-accordion'
import useOnScreen from '@/utilities/useInteraction'

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
  title: string
  episodeType: string
  episodeRange: string
  accordionsOpen?: string[]
  onResultChange?: (result: Result) => void  
  fallbackSvg: string
  fallbackPng: string
}

export const BooksGroupList: React.FC<Props> = (props) => {
  const {
    title,
    episodeType,
    episodeRange,
    accordionsOpen = [],
    onResultChange,
    fallbackSvg,
    fallbackPng,
  } = props

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | undefined>(undefined)
  const hasHydrated = useRef(false)
  const isRequesting = useRef(false)

  const [results, setResults] = useState<Episode[]>([])

  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useOnScreen(ref)

  const isOpen = accordionsOpen.includes(episodeRange)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (!isRequesting.current && (isVisible || isOpen)) {
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
          const req = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/episodes/byBook/${episodeType}/${episodeRange}`,
          )

          const json = (await req.json()) as Episode[]
          if (timer != null) {
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
          console.warn(err)  
          setIsLoading(false)
          setError(`Unable to load "series" data at this time.`)
        }

        isRequesting.current = false
        hasHydrated.current = true

        if (!isOpen) {
          setIsLoading(false)
        }
      }

      void makeRequest()
    } else {
      setIsLoading(false)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [episodeType, episodeRange, isOpen, isVisible])

  const accordionActionItem = isOpen ? (
    <ICON_SVG_REACT
      className="w-6 h-6 fill-black dark:fill-white"
      role="img"
      label="Click to redce"
      ariaHidden={false}
      svgInner={ICON_SVG_MINUS_REACT}
    />
  ) : (
    <ICON_SVG_REACT
      className="w-6 h-6 fill-black dark:fill-white"
      role="img"
      label="Click to expand"
      ariaHidden={false}
      svgInner={ICON_SVG_PLUS_REACT}
    />
  )

  return (
    <Accordion.AccordionItem ref={ref} className="accordionItem my-4" value={episodeRange}>
      <div className="border-1">
        <div className="flex flex-row bg-gray-100 dark:bg-neutral-900">
          <Accordion.AccordionHeader className="flex-grow px-2 py-2">
            <Accordion.AccordionTrigger className="flex-grow w-full">
              <div className="flex flex-row items-center">
                <span className="px-2">{accordionActionItem}</span>
                <h3 className="text-xl">{title}</h3>
                <span className="flex-grow" />
              </div>
            </Accordion.AccordionTrigger>
          </Accordion.AccordionHeader>
        </div>
        <Accordion.AccordionContent>
          {isLoading ? <Spinner /> : <></>}
          <div className="pl-6 pr-2">
            <ul>
              {results.map((result, index) => {
                if (typeof result === 'object' && result !== null) {
                  return (
                    <li key={index} className={classes.column}>
                      <EpisodeRow
                        doc={result}
                        fallbackSvg={fallbackSvg}
                        fallbackPng={fallbackPng}
                      />
                    </li>
                  )
                }

                return null
              })}
            </ul>
          </div>
        </Accordion.AccordionContent>
      </div>
    </Accordion.AccordionItem>
  )
}
