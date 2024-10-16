'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Tab, Tabs } from '@nextui-org/tabs'
import qs from 'qs'

import type { Page, Series } from '../../../payload/payload-types'
import { CardSeries } from '../../_components/CardSeries'
import { Gutter } from '../../_components/Gutter'
import { SeriesList } from '../SeriesList'

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
        <Gutter>
          <Tabs
            variant="underlined"
            size="lg"
            fullWidth={true}
            aria-label="Show sermons by grouping"
          >
            <Tab key="date" title="By Date">
              <p>Episodes by date</p>
            </Tab>
            <Tab key="series" title="By Series">
              <SeriesList />
            </Tab>
            <Tab key="passage" title="By Bible Passage">
              <p>Bible books</p>
            </Tab>
          </Tabs>
        </Gutter>
      </Fragment>
    </div>
  )
}
