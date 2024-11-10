/* eslint-disable @next/next/no-img-element */
'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'
import { StaticImageData } from 'next/image'

import type { CoverImage, Episode, Page, Series } from '@/payload-types'
import { Button } from '../Button'
import { EpisodeRow } from '../EpisodeRow'
import { ImageMedia } from '../Media/ImageMedia'
import RichText from '../RichText'

import classes from './index.module.scss'
import { EpisodeAudioPlayer } from '../EpisodeAudioPlayer'

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
type AudioPlayerType = 'none' | 'linked' | 'uploaded'

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
  if (videoType != 'none' && vimeoUrl.trim().length > 1) {
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
              <Button className="btn" appearance="primary" label="Play" onClick={onPlayClick} />
            </div>
            <ImageMedia
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

let AudioPlayerSection = ({ targetEpisode }: { targetEpisode: Episode }) => {
  let audioPlayerType: AudioPlayerType = 'none'
  if (targetEpisode.audioFormat === 'linked') {
    audioPlayerType = 'linked'
  } else if (
    targetEpisode.audioFormat === 'uploaded' &&
    typeof targetEpisode.uploadedAudioFile === 'object' &&
    targetEpisode.uploadedAudioFile !== undefined
  ) {
    audioPlayerType = 'uploaded'
  }

  if (audioPlayerType === 'none') {
    return <></>
  } else {
    return (
      <>
        <h2 className={classes.partHeading}>Listen</h2>
        <div className={classes.audioPlayer}>
          <EpisodeAudioPlayer targetEpisode={targetEpisode} />
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

export const EpisodeShow: React.FC<Props> = (props) => {
  const { targetEpisode, sort = '-createdAt' } = props

  let hasCoverImage = false
  let targetImage: CoverImage | string = ''
  let targetImageUrl: StaticImageData | undefined = {
    src: '/dpcPodcastGenericLogo_plain.svg',
    height: 300,
    width: 300,
  }

  let [doPlay, setDoPlay] = useState(false)

  let targetSeries = targetEpisode.series

  let videoPlayerType: VideoPlayerType = 'none'
  if (targetEpisode.videoFormat === 'vimeo') {
    videoPlayerType = 'vimeo'
  }

  let vimeoUrl = ''
  if (targetEpisode && targetEpisode.videoUrl) {
    let videoUrlParts = targetEpisode.videoUrl.match(
      /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/,
    )
    if (videoUrlParts) {
      vimeoUrl = 'https://player.vimeo.com/video/' + videoUrlParts[3]
    }
  }

  if (targetEpisode.episodeImage && typeof targetEpisode.episodeImage !== 'number') {
    targetImage = targetEpisode.episodeImage
    targetImageUrl = undefined
  } else if (
    targetSeries &&
    typeof targetSeries !== 'number' &&
    typeof targetSeries?.seriesImage !== 'number' &&
    targetSeries?.seriesImage?.url
  ) {
    targetImage = targetSeries?.seriesImage
    targetImageUrl = undefined
  }
  if (targetImageUrl === undefined || targetImageUrl === null) {
    targetImageUrl = {
      src: '/dpcPodcastGenericLogo_plain.svg',
      height: 1920,
      width: 1080,
    }
  }

  return (
    <div>
      {targetSeries ? <BackButton series={targetSeries} /> : <></>}
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
      <AudioPlayerSection targetEpisode={targetEpisode} />
      <h2 className={classes.partHeading}>Talk Outline</h2>
      {targetEpisode.talkOutline ? <RichText content={targetEpisode.talkOutline} /> : <></>}
      <div className={classes.belowEpisode} />
    </div>
  )
}
