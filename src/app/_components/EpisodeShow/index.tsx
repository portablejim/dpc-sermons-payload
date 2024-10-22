/* eslint-disable @next/next/no-img-element */
'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'
import { StaticImageData } from 'next/image'

import type { CoverImage, Episode, Page, Series } from '../../../payload/payload-types'
import { Button } from '../Button'
import { EpisodeRow } from '../EpisodeRow'
import { Image } from '../Media/Image'
import RichText from '../RichText'

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

let BackButton = ({ series }: { series: number | Series }) => {
  if (typeof series !== 'number') {
    let label = '< ' + series.title
    return (
      <>
        <Button className={classes.backButton} appearance="default" href=".." label={label} />
      </>
    )
  } else {
    return <></>
  }
}

type VideoPlayerType = 'none' | 'vimeo' | 'youtube'
type AudioPlayerType = 'none' | 'linked'

let PlayerSection = ({
  videoType,
  doPlay,
  targetImageUrl,
  targetImage,
  vimeoUrl,
  onPlayClick,
}: {
  videoType: VideoPlayerType
  doPlay: boolean
  targetImageUrl: StaticImageData
  targetImage: string | CoverImage
  vimeoUrl: string
  onPlayClick: () => void
}) => {
  if (videoType != 'none') {
    if (doPlay) {
      let iframe = <></>
      if (videoType === 'vimeo') {
        iframe = (
          <div className="embed-container">
            <iframe className={classes.playerIframe} src={vimeoUrl} allowFullScreen></iframe>
          </div>
        )
      }
      return (
        <>
          <h2 className={classes.partHeading}>Watch</h2>
          <div className={classes.videoPlayer}>
            <div className={classes.playerInner}>
              <img
                alt=""
                aria-hidden={true}
                className={classes.videoBgImage}
                tabIndex={-1}
                src='data:image/svg+xml;utf8,<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"></svg>'
              />
              {iframe}
            </div>
          </div>
        </>
      )
    }
    return (
      <>
        <h2 className={classes.partHeading}>Watch</h2>
        <div className={classes.videoPlayer}>
          <div className={classes.playerInner}>
            <div className={classes.playerPlayButton}>
              <Button appearance="primary" label="Play" onClick={onPlayClick} />
            </div>
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
        </div>
      </>
    )
  }

  return <></>
}

let AudioPlayerSection = ({
  playerType,
  mp3Url,
}: {
  playerType: AudioPlayerType
  mp3Url: string
}) => {
  if (playerType === 'none') {
    return <></>
  } else {
    return (
      <>
        <h2 className={classes.partHeading}>Listen</h2>
        <div className={classes.audioPlayer}>
          <audio controls={true}>
            <source src={mp3Url} type="audio/mpeg" />
          </audio>
        </div>
      </>
    )
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

  let [doPlay, setDoPlay] = useState(false)

  let targetSeries = targetEpisode.series

  let audioPlayerType: AudioPlayerType = 'none'
  if (targetEpisode.audioFormat === 'linked') {
    audioPlayerType = 'linked'
  }

  let videoPlayerType: VideoPlayerType = 'none'
  if (targetEpisode.videoFormat === 'embed') {
    videoPlayerType = 'vimeo'
  }

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
      <PlayerSection
        videoType={videoPlayerType}
        doPlay={doPlay}
        targetImage={targetImage}
        targetImageUrl={targetImageUrl}
        vimeoUrl={vimeoUrl}
        onPlayClick={() => {
          setDoPlay(true)
        }}
      />
      <AudioPlayerSection playerType={audioPlayerType} mp3Url={targetEpisode.audioUrl} />
      <h2 className={classes.partHeading}>Talk Outline</h2>
      <RichText content={targetEpisode.talkOutline} />
      <div className={classes.belowEpisode} />
    </div>
  )
}
