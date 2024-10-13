import type { Block } from 'payload/types'

import linkTile from '../../fields/linkTile'
import richText from '../../fields/richText'

export const LinkTileList: Block = {
  slug: 'link-tile-list',
  labels: {
    singular: 'Link List Tile',
    plural: 'Link List Tiles',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    richText({
      name: 'description',
      label: 'Description',
    }),
    {
      name: 'links',
      type: 'array',
      label: 'Link Tile',
      fields: [linkTile({})],
    },
  ],
}
