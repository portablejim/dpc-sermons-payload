import React, { Fragment } from 'react'
import Link from 'next/link'

import { CoverImage, Episode, Page, Series } from '@/payload-types'
import { Media } from '../Media'

import classes from './index.module.scss'

export const CardSeries: React.FC<{
  alignItems?: 'center'
  className?: string
  showCategories?: boolean
  hideImagesOnMobile?: boolean
  title?: string
  mediaType: 'video' | 'audio'
  doc?: Series
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

  const { slug, title } = doc || {}

  let targetImage: string | CoverImage = ''
  if (doc.seriesImage) {
    if (typeof doc.seriesImage !== 'number') {
      targetImage = doc.seriesImage
    }
  }

  const hasCategories = false
  const titleToUse = titleFromProps || title
  const sanitizedDescription = doc.subtitle?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/series/${slug}`

  return (
    <div
      className={[classes.card, className, orientation && classes[orientation]]
        .filter(Boolean)
        .join(' ')}
    >
      <Link href={href} className={classes.mediaWrapper}>
        {!targetImage && <div className={classes.placeholder}>No image</div>}
        {targetImage && typeof targetImage !== 'string' && (
          <Media
            imgClassName={classes.image}
            resource={targetImage}
            resourceType="coverImage"
            fill
          />
        )}
      </Link>
      <div className={classes.content}>
        {showCategories && hasCategories && <div className={classes.leader}></div>}
        {titleToUse && (
          <h4 className={classes.title}>
            <Link href={href} className={classes.titleLink}>
              {titleToUse}
            </Link>
          </h4>
        )}
        {doc.subtitle && (
          <div className={classes.body}>
            {doc.subtitle && <p className={classes.description}>{sanitizedDescription}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
