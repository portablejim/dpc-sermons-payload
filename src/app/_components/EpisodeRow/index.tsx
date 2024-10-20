import React, { Fragment } from 'react'
import { StaticImageData } from 'next/image'
import Link from 'next/link'

import { CoverImage, Episode, Page, Series } from '../../../payload/payload-types'
import { Media } from '../Media'
import { Image } from '../Media/Image'

import classes from './index.module.scss'

export const EpisodeRow: React.FC<{
  alignItems?: 'center'
  className?: string
  showCategories?: boolean
  hideImagesOnMobile?: boolean
  title?: string
  mediaType: 'video' | 'audio'
  doc?: Episode
  orientation?: 'horizontal' | 'vertical'
}> = props => {
  const {
    showCategories,
    title: titleFromProps,
    doc,
    className,
    orientation = 'vertical',
    mediaType,
  } = props

  const { slug, title, sermonDate, speaker, series, meta } = doc || {}
  const { image: metaImage } = meta || {}

  let hasCoverImage = false
  let targetImage: CoverImage | string = ''
  let targetImageUrl: StaticImageData | null = {
    src: '/dpc-mini-logo.png',
    height: 300,
    width: 300,
  }
  if (doc.episodeImage && typeof doc.episodeImage !== 'number') {
    targetImage = doc.episodeImage
    targetImageUrl = null
  } else if (
    doc.series &&
    typeof doc.series !== 'number' &&
    typeof doc.series?.seriesImage !== 'number' &&
    doc.series?.seriesImage?.url
  ) {
    targetImage = doc.series?.seriesImage
    targetImageUrl = null
  }

  if (typeof targetImage !== 'string' && targetImage.sizes?.thumbnail) {
    targetImageUrl = {
      src: targetImage.sizes.thumbnail.url,
      height: targetImage.sizes.thumbnail.height ?? 150,
      width: targetImage.sizes.thumbnail.width ?? 150,
    }
  }

  const displayDate = sermonDate.substring(0, 10).split('-').reverse().join('/')

  let hasSeries = false
  let seriesTitle = '(no series)'
  let seriesLink = ''
  let href = `/${mediaType}/sermon/${slug}`
  if (series !== undefined && typeof series !== 'number' && series.title && series.slug) {
    hasSeries = true
    seriesTitle = series.title
    seriesLink = `/series/${series.slug}`
    href = `${seriesLink}/${mediaType}/sermon/${slug}`
  }

  const hasCategories = false
  const titleToUse = titleFromProps || title
  const sanitizedDescription = doc.biblePassageText?.replace(/\s/g, ' ') // replace non-breaking space with white space

  return (
    <div
      className={[classes.generalRow, className, orientation && classes[orientation]]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={classes.imageContainer} aria-hidden={true}>
        <Image
          className={classes.generalCoverImage}
          alt=""
          src={targetImageUrl}
          resource={targetImage}
          resourceType="coverImage"
          fill={true}
        />
      </div>
      <div className={classes.generalRowDescription}>
        <span>
          <span>{displayDate}</span> |{' '}
          <Link href={href}>
            <span>{doc.title}</span>
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
