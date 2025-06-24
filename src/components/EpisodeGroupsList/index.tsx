'use client'

import React, { Suspense, use, useState } from 'react'
import type { Episode } from '@/payload-types'
import { Spinner } from "@heroui/react"
import { EpisodeGroupList } from '../EpisodeGroupList'
import * as Accordion from '@radix-ui/react-accordion'

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
  episodeType?: string
  initialEpisodeList?: Episode[]
  yearListPromise?: Promise<string[]>
  onResultChange?: (result: Result) => void // eslint-disable-line no-unused-vars
  fallbackSvg: string
  fallbackPng: string
}

export type MoreEpisodesProps = {
  baseUrl: string
  episodeType: string
  accordionsOpen: string[]
  episodeYearListPromise: Promise<string[]>
  fallbackSvg: string
  fallbackPng: string
}

const MoreEpisodeList: React.FC<MoreEpisodesProps> = (props) => {
  const { baseUrl, episodeType, accordionsOpen, episodeYearListPromise, fallbackSvg, fallbackPng } =
    props

  const episodeYearList = use(episodeYearListPromise)

  return (
    <>
      {episodeYearList.map((year) => {
        let yearRssUrl = `${baseUrl}/podcast/${episodeType}/${year}.rss`
        const yearTitle = year

        return (
          <EpisodeGroupList
            key={year}
            title={yearTitle}
            rssUrl={yearRssUrl}
            episodeType={episodeType}
            episodeRange={year}
            defaultOpen={false}
            accordionsOpen={accordionsOpen}
            fallbackSvg={fallbackSvg}
            fallbackPng={fallbackPng}
          />
        )
      })}
    </>
  )
}

export const EpisodeGroupsList: React.FC<Props> = (props) => {
  const {
    episodeType = 'regular',
    initialEpisodeList = [],
    yearListPromise = Promise.resolve([]),
    fallbackSvg,
    fallbackPng,
  } = props

  const baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL ?? ''

  let latestRssUrl = `${baseUrl}/podcast/${episodeType}/latest.rss`

  const [accordionState, setAccordionState] = useState(['latest'])

  return (
    <div>
      <Accordion.Root
        className="accordionRoot"
        type="multiple"
        value={accordionState}
        onValueChange={setAccordionState}
      >
        <EpisodeGroupList
          title="Latest"
          rssUrl={latestRssUrl}
          episodeType={episodeType}
          episodeRange="latest"
          defaultOpen={true}
          initialEpisodeList={initialEpisodeList}
          accordionsOpen={accordionState}
          fallbackSvg={fallbackSvg}
          fallbackPng={fallbackPng}
        />
        <Suspense fallback={<Spinner />}>
          <MoreEpisodeList
            baseUrl={baseUrl}
            episodeType={episodeType}
            episodeYearListPromise={yearListPromise}
            accordionsOpen={accordionState}
            fallbackSvg={fallbackSvg}
            fallbackPng={fallbackPng}
          />
        </Suspense>
      </Accordion.Root>
    </div>
  )
}
