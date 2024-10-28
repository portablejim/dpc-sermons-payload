'use client'

import React, { Fragment, ReactNode } from 'react'
import { Tab, Tabs } from '@nextui-org/react'

import type { Episode, Series } from '@/payload-types'

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
  byDateTab: ReactNode,
  bySeriesTab: ReactNode,
  byPassageTab: ReactNode,
}

export const LibraryList: React.FC<Props> = props => {
  const { byDateTab, bySeriesTab, byPassageTab } = props

  return (
    <Tabs
      variant="solid"
      radius="none"
      size="lg"
      fullWidth={true}
      aria-label="Show sermons by grouping"
    >
      <Tab key="date" title="By Date">
        {byDateTab}
      </Tab>
      <Tab key="series" title="By Series">
        {bySeriesTab}
      </Tab>
      <Tab key="passage" title="By Bible Passage">
        {byPassageTab}
      </Tab>
    </Tabs>
  )
}
