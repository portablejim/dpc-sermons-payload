'use client'

import React from 'react'

import { LinkTileListProps } from '../../blocks/LinkTileList/types'
import { LinkTile } from '../LinkTile'
import RichText from '../RichText'

import classes from './index.module.scss'

export type Props = {
  className?: string
  limit?: number
  showPageRange?: boolean
  sort?: string
}

export const LinkTileGroup: React.FC<Props & LinkTileListProps> = (props) => {
  const { title, description, linkTiles, className } = props

  let showTitle = false
  if (title && title?.length > 0) {
    showTitle = true
  }

  const tileList = linkTiles?.map((lt) => <LinkTile key={lt.id} linkTile={lt.linkTile} />) ?? []
  const descriptionRichText = description ?? []

  return (
    <div className="linkTileGroup">
      {showTitle ? (
        <>
          <h3 className={classes.categoryHeader}>{title}</h3>
          <hr className={classes.categoryRule} />
        </>
      ) : (
        <></>
      )}
      <RichText content={descriptionRichText} />
      <div className={[classes.tileListGrid, className].filter(Boolean).join(' ')}>{tileList}</div>
    </div>
  )
}
