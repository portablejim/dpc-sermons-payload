/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { StaticImageData } from 'next/image'
import NextImage from 'next/image'

import type { CoverImage, Episode, Series } from '@/payload-types'
import { Button } from '../Button'
import RichText from '../RichText'

import classes from './index.module.scss'
import { EpisodeAudioPlayer } from '../EpisodeAudioPlayer'
import { svgToDataURI, BACKGROUND_LOGO_SVG_WIDE } from '@/utilities/iconsSvg'
import Link from 'next/link'

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

const BackButton = ({ series }: { series: number | Series }) => {
  if (typeof series !== 'number') {
    const label = '< ' + series.title
    return (
      <>
        <Link className={classes.backButton} href="..">{label}</Link>
      </>
    )
  } else {
    return <></>
  }
}

type VideoPlayerType = 'none' | 'vimeo' | 'youtube'
type AudioPlayerType = 'none' | 'linked' | 'uploaded'

const PlayerSection = ({
  videoType,
  doPlay,
  targetImageUrl,
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
            <NextImage
              alt=""
              className={classes.playerCoverImage}
              fill={true}
              onLoad={() => {
                /*
                setIsLoading(false)
                if (typeof onLoadFromProps === 'function') {
                  onLoadFromProps()
                }
                  */
              }}
              priority={true}
              //quality={90}
              //sizes={sizes}
              placeholder={svgToDataURI(BACKGROUND_LOGO_SVG_WIDE)}
              src={targetImageUrl}
              unoptimized={targetImageUrl.src.endsWith('svg')}
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

const AudioPlayerSection = ({ targetEpisode }: { targetEpisode: Episode }) => {
  const downloadButtonData: { label: string; url: string }[] = []
  let audioPlayerType: AudioPlayerType = 'none'
  if (targetEpisode.audioFormat === 'linked') {
    audioPlayerType = 'linked'
    if (targetEpisode.linkedAudioUrl) {
      downloadButtonData.push({ label: 'Download', url: targetEpisode.linkedAudioUrl })
    }
  } else if (
    targetEpisode.audioFormat === 'uploaded' &&
    typeof targetEpisode.uploadedAudioFile === 'object' &&
    targetEpisode.uploadedAudioFile !== undefined
  ) {
    audioPlayerType = 'uploaded'
    if (
      targetEpisode.uploadedAudioFile?.status == 'initial' &&
      targetEpisode.uploadedAudioFile?.filename
    ) {
      downloadButtonData.push({ label: 'Download', url: targetEpisode.uploadedAudioFile?.filename })
    }
  }

  const downloadButtons = downloadButtonData.map((dbd, i) => (
    <a
      key={i}
      href={dbd.url}
      className="border-gray-500 border-1 px-3 py-2 rounded-full "
      download={true}
    >
      {dbd.label}
    </a>
  ))

  if (audioPlayerType === 'none') {
    return <></>
  } else {
    return (
      <>
        <h2 className={classes.partHeading}>Listen</h2>
        <div className={classes.audioPlayer}>
          <EpisodeAudioPlayer targetEpisode={targetEpisode} />
        </div>
        <div className="py-4">{downloadButtons}</div>
      </>
    )
  }
}

export type Props = {
  targetEpisode: Episode
  className?: string
  limit?: number
  onResultChange?: (result: Result) => void
  showPageRange?: boolean
  sort?: string
  fallbackSvg: string
  fallbackPng: string
}

export const EpisodeShow: React.FC<Props> = (props) => {
  const { targetEpisode, fallbackSvg } = props

  let targetImage: CoverImage | string = ''
  let targetImageUrl: StaticImageData | undefined = {
    src: fallbackSvg,
    height: 1920,
    width: 1080,
  }

  const [doPlay, setDoPlay] = useState(false)

  const targetSeries = targetEpisode.series

  let videoPlayerType: VideoPlayerType = 'none'
  if (targetEpisode.videoFormat === 'vimeo') {
    videoPlayerType = 'vimeo'
  }

  let vimeoUrl = ''
  if (targetEpisode && targetEpisode.videoUrl) {
    const videoUrlParts = targetEpisode.videoUrl.match(
      /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/,
    )
    if (videoUrlParts) {
      vimeoUrl = 'https://player.vimeo.com/video/' + videoUrlParts[3]
    }
  }

  if (targetEpisode.episodeImage && typeof targetEpisode.episodeImage !== 'number') {
    targetImage = targetEpisode.episodeImage
  } else if (
    targetSeries &&
    typeof targetSeries !== 'number' &&
    typeof targetSeries?.seriesImage !== 'number' &&
    targetSeries?.seriesImage?.url
  ) {
    targetImage = targetSeries?.seriesImage
  }

  if (typeof targetImage != 'string' && targetImage.sizes?.card !== undefined) {
    targetImageUrl = {
      width: targetImage.sizes?.card?.width ?? 0,
      height: targetImage.sizes?.card?.height ?? 0,
      src: targetImage.sizes?.card?.url ?? '',
    }
  }

  if (targetImageUrl === undefined || targetImageUrl === null) {
    targetImageUrl = {
      src: fallbackSvg,
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
      <p className="text-center text-lg">
        {targetSeries && typeof targetSeries !== 'number' ? targetSeries.title : ''}
        {targetSeries &&
        typeof targetSeries !== 'number' &&
        targetEpisode.speaker &&
        typeof targetEpisode.speaker !== 'number'
          ? ' | '
          : ''}
        {targetEpisode.speaker && typeof targetEpisode.speaker !== 'number'
          ? (targetEpisode.speaker?.name ?? '')
          : ''}
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
