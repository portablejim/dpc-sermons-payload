/* eslint-disable @next/next/no-img-element */
'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'
import { StaticImageData } from 'next/image'

import type { CoverImage, Episode, Page, Series } from '../../../payload/payload-types'
import { Button } from '../Button'
import { EpisodeRow } from '../EpisodeRow'
import { Image } from '../Media/Image'

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

let HeroImage = ({ seriesImage }: { seriesImage: number | CoverImage }): JSX.Element => {
  if (typeof seriesImage != 'number') {
    return (
      <>
        <Image resource={seriesImage} resourceType="coverImage" sizeType="card" />
      </>
    )
  }
  return <></>
}

let BackButton = ({ series }: { series: number | Series }) => {
  if (typeof series !== 'number') {
    let label = '< ' + series.title
    return (
      <>
        <Button appearance="default" href=".." label={label} />
      </>
    )
  } else {
    return <></>
  }
}

export type Props = {
  targetEpisode: Episode
  className?: string
  limit?: number
  onResultChange?: (result: Result) => void // eslint-disable-line no-unused-vars
  showPageRange?: boolean
  sort?: string
}

export const EpisodeShow: React.FC<Props> = props => {
  const { targetEpisode, sort = '-createdAt' } = props

  let hasCoverImage = false
  let targetImage: CoverImage | string = ''
  let targetImageUrl: StaticImageData | null = {
    src: '/dpc-mini-logo.png',
    height: 300,
    width: 300,
  }

  let targetSeries = targetEpisode.series

  let vimeoUrl =
    'https://player.vimeo.com/video/' +
    targetEpisode.videoUrl.match(
      /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/,
    )[3]

  if (targetEpisode.episodeImage && typeof targetEpisode.episodeImage !== 'number') {
    targetImage = targetEpisode.episodeImage
    targetImageUrl = null
  } else if (
    targetSeries &&
    typeof targetSeries !== 'number' &&
    typeof targetSeries?.seriesImage !== 'number' &&
    targetSeries?.seriesImage?.url
  ) {
    targetImage = targetSeries?.seriesImage
    targetImageUrl = null
  }

  return (
    <div>
      <BackButton series={targetSeries} />
      <h1 className={classes.heading}>{targetEpisode.title}</h1>
      <p className={classes.subheading}>
        <em>{targetEpisode.biblePassageText}</em>
      </p>
      <div className={classes.videoPlayer}>
        <div className={classes.playerInner}>
          <Image
            className={classes.playerCoverImage}
            alt=""
            src={targetImageUrl}
            resource={targetImage}
            resourceType="coverImage"
            fill={true}
          />
          <img
            alt=""
            aria-hidden={true}
            className={classes.videoBgImage}
            tabIndex={-1}
            src='data:image/svg+xml;utf8,<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"></svg>'
          />
          <div className="embed-container">
            <iframe className={classes.playerIframe} src={vimeoUrl} allowFullScreen></iframe>
          </div>
        </div>
        "
      </div>
    </div>
  )
}
