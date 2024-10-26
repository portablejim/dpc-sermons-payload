import React, { Fragment } from 'react'
import { StaticImageData } from 'next/image'
import Link from 'next/link'

import { CoverImage, Episode, Page, Series } from '@/payload-types'
import { Media } from '../Media'
import { ImageMedia } from '../Media/ImageMedia'

import classes from './index.module.scss'

export const EpisodeRow: React.FC<{
  alignItems?: 'center'
  className?: string
  showCategories?: boolean
  hideImagesOnMobile?: boolean
  title?: string
  mediaType: 'video' | 'audio'
  doc?: Episode
  paramSeries?: Series
  orientation?: 'horizontal' | 'vertical'
}> = props => {
  const {
    showCategories,
    title: titleFromProps,
    doc,
    paramSeries,
    className,
    orientation = 'vertical',
    mediaType,
  } = props

  const { slug, title, sermonDate, speaker, series } = doc || {}

  let hasCoverImage = false
  let targetImage: CoverImage | string = ''
  let targetImageUrl: StaticImageData | undefined = {
    src: '/dpc-mini-logo.png',
    height: 300,
    width: 300,
  }

  let targetSeries = series
  if (paramSeries !== undefined && typeof paramSeries !== 'number') {
    targetSeries = paramSeries
  }

  if (doc && doc.episodeImage && typeof doc.episodeImage !== 'number') {
    targetImage = doc.episodeImage
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

  if (typeof targetImage !== 'string' && targetImage.sizes?.thumbnail) {
    targetImageUrl = {
      src: targetImage.sizes.thumbnail.url ?? '',
      height: targetImage.sizes.thumbnail.height ?? 150,
      width: targetImage.sizes.thumbnail.width ?? 150,
    }
  }

  const displayDate = sermonDate?.substring(0, 10).split('-').reverse().join('/')

  let hasSeries = false
  let seriesTitle = '(no series)'
  let seriesLink = ''
  let href = `/sermon/${slug}`
  if (
    targetSeries !== undefined &&
    typeof targetSeries !== 'number' &&
    targetSeries &&
    targetSeries.title &&
    targetSeries.slug
  ) {
    hasSeries = true
    seriesTitle = targetSeries.title
    seriesLink = `/series/${targetSeries.slug}`
    href = `${seriesLink}/sermon/${slug}`
  }

  const hasCategories = false
  const titleToUse = titleFromProps || title
  const sanitizedDescription = doc?.biblePassageText?.replace(/\s/g, ' ') // replace non-breaking space with white space

  return (
    <div
      className={[classes.generalRow, className, orientation && classes[orientation]]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={classes.imageContainer} aria-hidden={true}>
        <ImageMedia
          className={classes.generalCoverImage}
          alt=""
          src={targetImageUrl}
          resource={targetImage}
          /*resourceType="coverImage"*/
          fill={true}
        />
      </div>
      <div className={classes.generalRowDescription}>
        <span>
          <span>{displayDate}</span> |{' '}
          <Link href={href}>
            <span>{doc?.title}</span>
          </Link>
        </span>
        <span>
          {hasSeries ? (
            <>
              <Link href={seriesLink}>{seriesTitle}</Link>
            </>
          ) : (
            seriesTitle
          )}
        </span>
      </div>
    </div>
  )
}
