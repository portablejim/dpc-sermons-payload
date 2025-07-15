import React from 'react'
import { StaticImageData } from 'next/image'
import Link from 'next/link'

import { CoverImage, Episode, Series } from '@/payload-types'

import classes from './index.module.scss'
import {
  BACKGROUND_LOGO_SVG_WIDE,
  ICON_SVG_CHEVRON_RIGHT_REACT,
  ICON_SVG_REACT,
  svgToDataURI,
} from '@/utilities/iconsSvg'
import { EpisodeAudioPlayer, EpisodeAudioPlayerContext, ListenButton } from '../EpisodeAudioPlayer'

export const EpisodeRow: React.FC<{
  alignItems?: 'center'
  className?: string
  showCategories?: boolean
  hideImagesOnMobile?: boolean
  title?: string
  doc?: Episode
  paramSeries?: Series
  orientation?: 'horizontal' | 'vertical'
  fallbackSvg: string
  fallbackPng: string
}> = (props) => {
  const {
    title: titleFromProps,
    doc,
    paramSeries,
    className,
    orientation = 'vertical',
    fallbackSvg,
  } = props

  const { slug, title, sermonDate, series } = doc || {}

  let targetImage: CoverImage | string = ''
  let targetImageUrl: StaticImageData | undefined = {
    src: fallbackSvg,
    height: 300,
    width: 300,
  }

  const imgSources: { url: string; type: string | undefined; focalPoint: string }[] = []

  let targetSeries = series
  if (paramSeries !== undefined && typeof paramSeries !== 'number') {
    targetSeries = paramSeries
  }

  if (doc && doc.episodeImage && typeof doc.episodeImage !== 'number') {
    targetImage = doc.episodeImage
  } else if (
    targetSeries &&
    typeof targetSeries !== 'number' &&
    typeof targetSeries?.seriesImage !== 'number' &&
    targetSeries?.seriesImage?.url
  ) {
    targetImage = targetSeries?.seriesImage
  }

  if (typeof targetImage !== 'string') {
    if (
      typeof targetImage.squareSvg != 'number' &&
      targetImage.squareSvg !== undefined &&
      targetImage.squareSvg !== null &&
      targetImage.squareSvg?.id !== null
    ) {
      imgSources.push({
        url: `/api/cover-image-svgs/byVersion/${targetImage?.squareSvg?.id}/${targetImage?.squareSvg?.version}/${targetImage?.squareSvg?.filename} 1x`,
        type: targetImage.squareSvg.mimeType ?? 'image/svg+xml',
        focalPoint: targetImage.squareSvg.svgFocalPoint ?? 'center-center',
      })
    }
    if (targetImage.sizes?.thumbnail_webp?.url && targetImage.sizes?.thumbnail_large?.url) {
      imgSources.push({
        url: `/api/cover-images/byVersion/${targetImage?.id}/${targetImage?.version}/thumbnail_webp/${targetImage?.filename} 1x, /api/cover-images/byVersion/${targetImage?.id}/${targetImage?.version}/thumbnail_large/${targetImage?.filename} 2x`,
        type: targetImage.sizes?.thumbnail_webp.mimeType ?? undefined,
        focalPoint: 'center-center',
      })
    } else if (targetImage.sizes?.thumbnail_webp?.url) {
      imgSources.push({
        url: `/api/cover-images/byVersion/${targetImage?.id}/${targetImage?.version}/thumbnail_webp/${targetImage?.filename}`,
        type: targetImage.sizes?.thumbnail_webp.mimeType ?? undefined,
        focalPoint: 'center-center',
      })
    } else if (targetImage.sizes?.thumbnail_large?.url) {
      imgSources.push({
        url: `/api/cover-images/byVersion/${targetImage?.id}/${targetImage?.version}/thumbnail_large/${targetImage?.filename}`,
        type: targetImage.sizes?.thumbnail_large.mimeType ?? undefined,
        focalPoint: 'center-center',
      })
    }
    if (targetImage.sizes?.thumbnail) {
      targetImageUrl = {
        src: `/api/cover-images/byVersion/${targetImage?.id}/${targetImage?.version}/thumbnail/${targetImage?.filename}`,
        height: targetImage.sizes.thumbnail.height ?? 150,
        width: targetImage.sizes.thumbnail.width ?? 150,
      }
    } else {
      targetImageUrl = {
        src: targetImage.url ?? '',
        height: targetImage.height ?? 150,
        width: targetImage.width ?? 150,
      }
    }
  }

  const sourcesList = imgSources.map((s, i) => {
    let sourceClassName = 'object-cover'
    if (s.focalPoint == 'top-left') {
      sourceClassName += ' object-left-top'
    }
    if (s.focalPoint == 'top-center') {
      sourceClassName += ' object-top'
    }
    if (s.focalPoint == 'top-right') {
      sourceClassName += ' object-right-top'
    }
    if (s.focalPoint == 'center-left') {
      sourceClassName += ' object-left'
    }
    if (s.focalPoint == 'center-center') {
      sourceClassName += ' object-center'
    }
    if (s.focalPoint == 'center-right') {
      sourceClassName += ' object-right'
    }
    if (s.focalPoint == 'bottom-left') {
      sourceClassName += ' object-left-bottom'
    }
    if (s.focalPoint == 'bottom-center') {
      sourceClassName += ' object-bottom'
    }
    if (s.focalPoint == 'bottom-right') {
      sourceClassName += ' object-right-bottom'
    }

    return <source key={i} srcSet={s.url} className={sourceClassName} type={s.type} />
  })

  const displayDate = sermonDate?.substring(0, 10).split('-').reverse().join('/')

  let hasSeries = false
  let seriesTitle = '(no series)'
  let seriesLink = ''
  let href = `/talks/sermon/${slug}`
  if (
    targetSeries !== undefined &&
    typeof targetSeries !== 'number' &&
    targetSeries &&
    targetSeries.title &&
    targetSeries.slug
  ) {
    hasSeries = true
    seriesTitle = targetSeries.title
    seriesLink = `/talks/series/${targetSeries.slug}`
    href = `${seriesLink}/sermon/${slug}`
  }

  let detailsButtonText = 'Details'
  if (doc?.videoFormat !== 'none') {
    detailsButtonText = 'Details / Watch'
  }

  const titleToUse = titleFromProps || title
  const sanitizedDescription = doc?.biblePassageText?.replace(/\s/g, ' ') // replace non-breaking space with white space

  const loaderImage = svgToDataURI(BACKGROUND_LOGO_SVG_WIDE)
  const loaderImageUrl = `url("${loaderImage}")`

  return (
    <div className="border-b-1 border-b-grey-900 py-2">
      <EpisodeAudioPlayerContext>
        <div
          className={[classes.generalRow, className, orientation && classes[orientation]]
            .filter(Boolean)
            .join(' ')}
        >
          <div
            className={classes.imageContainer}
            aria-hidden={true}
            style={{ backgroundImage: loaderImageUrl }}
          >
            <picture className="w-full h-full bg-cover bg-center">
              {sourcesList}
              <img src={targetImageUrl.src} alt="" />
            </picture>
          </div>
          <div className={classes.generalRowDescription}>
            <span className="flex flex-col sm:flex-row">
              <span tabIndex={0}>{displayDate}</span>
              <span className="hidden px-1 sm:inline"> | </span>
              <Link href={href}>
                <span className="font-bold">{titleToUse}</span>
              </Link>
            </span>
            <span className="flex flex-col sm:block">
              <span>{sanitizedDescription}</span>
              <span className="hidden px-1 sm:inline"> | </span>
              <span>
                {hasSeries ? (
                  <>
                    <Link href={seriesLink}>{seriesTitle}</Link>
                  </>
                ) : (
                  seriesTitle
                )}
              </span>
            </span>
          </div>
          <div className="flex flex-row flex-shrink-0 flex-grow xs:flex-grow-0">
            <ListenButton audioFormat={doc?.audioFormat ?? 'none'} />
            <div className="flex-shrink-0 flex">
              <Link
                className="px-2 h-10 leading-10 text-nowrap border-gray-200 border-solid border-1 block xs:hidden md:block"
                href={href}
              >
                {detailsButtonText}
              </Link>
              <Link
                className="px-2 h-10 leading-10 flex-shrink-0 items-center text-nowrap border-gray-200 border-solid border-1 hidden xs:flex md:hidden"
                href={href}
                title={detailsButtonText}
              >
                <ICON_SVG_REACT
                  className="w-6 h-6 fill-black dark:fill-white"
                  role="img"
                  label={detailsButtonText}
                  ariaHidden={false}
                  svgInner={ICON_SVG_CHEVRON_RIGHT_REACT}
                />
              </Link>
            </div>
          </div>
        </div>
        {doc !== undefined ? (
          <EpisodeAudioPlayer targetEpisode={doc} defaultShown={false} />
        ) : (
          <></>
        )}
      </EpisodeAudioPlayerContext>
    </div>
  )
}
