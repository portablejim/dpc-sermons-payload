'use client'

import React, { Fragment, useEffect, useRef, useState } from 'react'
import qs from 'qs'

import type { Page, Series } from '../../../payload/payload-types'
import { LinkTileListProps, LinkTileListTileProps } from '../../_blocks/LinkTileList/types'
import { Gutter } from '../Gutter'
import { HR } from '../HR'
import { LinkTile } from '../LinkTile'
import RichText from '../RichText'

import classes from './index.module.scss'

export type Props = {
  className?: string
  limit?: number
  showPageRange?: boolean
  sort?: string
}

export const LinkTileGroup: React.FC<Props & LinkTileListProps> = props => {
  const {
    title,
    description,
    linkTiles,
    className,
    limit = 10,
    showPageRange,
    sort = '-createdAt',
  } = props

  let showTitle = false
  if (title?.length > 0) {
    showTitle = true
  }

  let linkTileNum = linkTiles.length
  let tileList = linkTiles.map(lt => <LinkTile key={lt.id} linkTile={lt.linkTile} />)

  return (
    <div className="linkTileGroup">
      {showTitle ? (
        <>
          <h3 className={classes.categoryHeader}>{title}</h3>
          <HR className={classes.categoryRule} />
        </>
      ) : (
        <></>
      )}
      <RichText content={description} />
      <div className={[classes.tileListGrid, className].filter(Boolean).join(' ')}>{tileList}</div>
    </div>
  )
}
