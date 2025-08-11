'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import type { CoverImage } from '@/payload-types'
import { LinkTileListTileProps } from '../../blocks/LinkTileList/types'

import classes from './index.module.scss'
import { usePathname } from 'next/navigation'

export type Props = {
  linkTile: LinkTileListTileProps
  className?: string
  limit?: number
  showPageRange?: boolean
  sort?: string
}

export const LinkTile: React.FC<Props> = props => {
  const { linkTile, className } = props

  const pathname = usePathname();

  const baseUrl = typeof window !== "undefined" ? window.location.origin : process.env.APP_URL_HUB ?? ''
  let bgImage = ''
  let ltImg: CoverImage | null = null
  if (typeof linkTile.backgroundImage !== 'number') {
    ltImg = linkTile.backgroundImage
    if(ltImg) {
      bgImage = `${baseUrl}/upload/cover-images/${ltImg.filename}`
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
    let pathPrefix = ''
    if(pathname && pathname.startsWith('/hub')) {
      pathPrefix = '/hub'
    }
    targetUrl = `${pathPrefix}/${linkTile?.reference?.value?.slug}`
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
