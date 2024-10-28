'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Tab, Tabs } from '@nextui-org/react'

import type { Page, Series } from '@/payload-types'
import { EpisodeList } from '../../components/EpisodeList'
import { SeriesList } from '../../components/SeriesList'
import { Gutter } from '../../components/Gutter'

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

export const LibraryList: React.FC<Props> = props => {
  const { className } = props

  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className={[classes.collectionArchive, className].filter(Boolean).join(' ')}>
      <div className={classes.scrollRef} ref={scrollRef} />
      <Fragment>
          <div className='container flex flex-col justify-between'>
          <Tabs
            variant="solid"
            radius="none"
            size="lg"
            fullWidth={true}
            aria-label="Show sermons by grouping"
          >
            <Tab key="date" title="By Date">
              <div className="episodeListContainer">
                <EpisodeList />
              </div>
            </Tab>
            <Tab key="series" title="By Series">
              <SeriesList />
            </Tab>
            <Tab key="passage" title="By Bible Passage">
              <p>Bible books</p>
            </Tab>
          </Tabs>
          </div>
      </Fragment>
    </div>
  )
}
