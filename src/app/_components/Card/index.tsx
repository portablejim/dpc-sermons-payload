import React, { Fragment } from 'react'
import Link from 'next/link'

import { CoverImage, Episode, Page, Series } from '../../../payload/payload-types'
import { Media } from '../Media'

import classes from './index.module.scss'

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  showCategories?: boolean
  hideImagesOnMobile?: boolean
  title?: string
  relationTo?: 'projects' | 'posts'
  doc?: Series | Episode | Page
  orientation?: 'horizontal' | 'vertical'
}> = props => {
  const {
    relationTo,
    showCategories,
    title: titleFromProps,
    doc,
    className,
    orientation = 'vertical',
  } = props

  const { slug, title, meta } = doc || {}
  const { description, image: metaImage } = meta || {}

  let targetImage: null | CoverImage = null

  const hasCategories = false
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <div
      className={[classes.card, className, orientation && classes[orientation]]
        .filter(Boolean)
        .join(' ')}
    >
      <Link href={href} className={classes.mediaWrapper}>
        {!metaImage && <div className={classes.placeholder}>No image</div>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media imgClassName={classes.image} resource={metaImage} fill />
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
        {description && (
          <div className={classes.body}>
            {description && <p className={classes.description}>{sanitizedDescription}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
