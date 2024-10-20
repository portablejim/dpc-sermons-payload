'use client'

import React from 'react'
import NextImage, { StaticImageData } from 'next/image'

import {
  CoverImage,
  type CoverImage as CoverImageType,
  Media,
} from '../../../../payload/payload-types'
import cssVariables from '../../../cssVariables'
import { Props as MediaProps } from '../types'

import classes from './index.module.scss'

const { breakpoints } = cssVariables

export const Image: React.FC<MediaProps> = props => {
  const {
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    resource,
    resourceType,
    sizeType,
    priority,
    fill,
    src: srcFromProps,
    alt: altFromProps,
  } = props

  const [isLoading, setIsLoading] = React.useState(true)

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''

  function isCoverImageType(img: Media | CoverImage): img is CoverImage {
    const coverImg: CoverImage = img
    return typeof coverImg.sizes.card === 'object' && typeof coverImg.sizes.thumbnail === 'object'
  }

  if (!src && resource && typeof resource !== 'string') {
    const {
      width: fullWidth,
      height: fullHeight,
      filename: fullFilename,
      alt: altFromResource,
    } = resource

    width = fullWidth
    height = fullHeight
    alt = altFromResource
    let sizeFilename = fullFilename

    if (sizeType == 'card' && isCoverImageType(resource)) {
      width = resource.sizes.card.width
      height = resource.sizes.card.height
      sizeFilename = resource.sizes.card.filename
    }

    const filename = sizeFilename

    src = `${process.env.NEXT_PUBLIC_SERVER_URL}/media/${filename}`
    if (resourceType === 'coverImage') {
      src = `${process.env.NEXT_PUBLIC_SERVER_URL}/cover-images/${filename}`
    }
  }

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes = Object.entries(breakpoints)
    .map(([, value]) => `(max-width: ${value}px) ${value}px`)
    .join(', ')

  return (
    <NextImage
      className={[isLoading && classes.placeholder, classes.image, imgClassName]
        .filter(Boolean)
        .join(' ')}
      src={src}
      alt={alt || ''}
      onClick={onClick}
      onLoad={() => {
        setIsLoading(false)
        if (typeof onLoadFromProps === 'function') {
          onLoadFromProps()
        }
      }}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      sizes={sizes}
      priority={priority}
    />
  )
}
