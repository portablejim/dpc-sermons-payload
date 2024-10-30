import React, { Fragment } from 'react'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

import { CoverImage, Episode, Page, Series } from '@/payload-types'
import { Media } from '../Media'
import { ImageMedia } from '../Media/ImageMedia'

import classes from './index.module.scss'
import { Button } from '@payloadcms/ui'
import { ICON_SVG_CHEVRON_RIGHT, ICON_SVG_MUSIC, svgToDataURI } from '@/utilities/iconsSvg'

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

  let detailsButtonText = 'Details'
  if (doc?.videoFormat !== 'none') {
    detailsButtonText = 'Details / Watch'
  }

  let listenButton = <></>
  if (doc?.audioFormat !== 'none') {
    listenButton = <div className="flex-shrink-0 flex">
      <Button className="px-2 h-10 mx-1 leading-10 text-nowrap border-gray-200 border-solid border-1 hidden md:block">Listen</Button>
      <Button className="px-2 h-10 mx-1 leading-10 flex-shrink-0 flex items-center text-nowrap border-gray-200 border-solid border-1 md:hidden"><Image src={svgToDataURI(ICON_SVG_MUSIC)} alt={detailsButtonText} width={16} height={16} /></Button>
      </div>
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
        <span className="flex flex-col sm:flex-row">
          <span tabIndex={0}>{displayDate}</span><span className="hidden px-1 sm:inline"> | </span>
          <Link href={href}>
            <span className="font-bold">{doc?.title}</span>
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
      <div className='flex flex-row flex-shrink-0 flex-grow xs:flex-grow-0'>
      {listenButton}
      <div className="flex-shrink-0 flex">
          <Link className="px-2 h-10 leading-10 text-nowrap border-gray-200 border-solid border-1 block xs:hidden md:block" href={href}>{detailsButtonText}</Link>
          <Link className="px-2 h-10 leading-10 flex-shrink-0 text-nowrap border-gray-200 border-solid border-1 hidden xs:flex md:hidden" href={href}><Image src={svgToDataURI(ICON_SVG_CHEVRON_RIGHT)} alt={detailsButtonText} width={16} height={16} /></Link>
      </div>
      </div>
    </div>
  )
}
