'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import type { CoverImage, Page, Series } from '@/payload-types'
import { LinkTileListTileProps } from '../../blocks/LinkTileList/types'

import classes from './index.module.scss'

export type Props = {
  linkTile: LinkTileListTileProps
  className?: string
  limit?: number
  showPageRange?: boolean
  sort?: string
}

export const LinkTile: React.FC<Props> = props => {
  const { linkTile, className, limit = 10, showPageRange, sort = '-createdAt' } = props

  let bgImage = ''
  let ltImg: CoverImage | null = null
  if (typeof linkTile.backgroundImage !== 'number') {
    ltImg = linkTile.backgroundImage
    if(ltImg) {
      bgImage = `${process.env.NEXT_PUBLIC_SERVER_URL}/upload/cover-images/${ltImg.filename}`
    }
  }

  let targetUrl = ''
  if (linkTile.type == 'mediaReference' && typeof linkTile.linkedMedia !== 'number') {
    if (linkTile.newTab) {
      targetUrl = `/api/media/preview/${linkTile.linkedMedia?.id}`
    } else {
      targetUrl = `/api/media/download/${linkTile.linkedMedia?.id}`
    }
  } else if (typeof linkTile === 'object' && linkTile.type == 'reference' && typeof linkTile?.reference?.value !== 'number') {
    targetUrl = `/${linkTile?.reference?.value?.slug}`
  } else {
    targetUrl = linkTile.url ?? ''
  }

  const overlayStyle = { backgroundColor: linkTile.overlayColour ?? 'transparent' }

  return (
    <Link href={targetUrl} target={linkTile.newTab ? '_blank' : ''}>
      <div className={[classes.tileOuter, className].filter(Boolean).join(' ')}>
        <Image src={bgImage} layout="fill" className="object-cover" alt="Background image" />
        <div className={classes.overlay} style={overlayStyle}></div>
        <div className={[classes.tileInner, className].filter(Boolean).join(' ')}>
          <p>
            <strong>{linkTile.title}</strong>
          </p>
          <p>{linkTile.subtitle}</p>
        </div>
      </div>
    </Link>
  )
}
