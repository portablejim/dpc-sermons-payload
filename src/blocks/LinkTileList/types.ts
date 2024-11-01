import linkTile from '@/fields/linkTile'
import type { Page } from '@/payload-types'

export type LinkTileListProps = Extract<Page['layout'][0], { blockType: 'linkTileList' }>
export type LinkTileListTilesProps = LinkTileListProps['linkTiles']
export type LinkTileListTileProps = Extract<FlatArray<LinkTileListTilesProps, 1>, {linkTile: object}>['linkTile']