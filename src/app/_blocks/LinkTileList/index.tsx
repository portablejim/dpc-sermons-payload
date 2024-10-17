import React, { Fragment } from 'react'
import payload from 'payload'

import { Gutter } from '../../_components/Gutter'
import { LinkTileGroup } from '../../_components/LinkTileGroup'
import { LinkTileListProps } from './types'

import classes from './index.module.scss'

export type Props = {
  className?: string
  limit?: number
  onResultChange?: (result: any) => void // eslint-disable-line no-unused-vars
  showPageRange?: boolean
  sort?: string
}

export const LinkTileList: React.FC<Props & LinkTileListProps> = props => {
  const { title, description, linkTiles, className } = props

  return (
    <div className={[classes.collectionArchive, className].filter(Boolean).join(' ')}>
      <Fragment>
        <Gutter>
          <div>
            <LinkTileGroup
              title={title}
              description={description}
              linkTiles={linkTiles}
              blockType="linkTileList"
            />
          </div>
        </Gutter>
      </Fragment>
    </div>
  )
}
