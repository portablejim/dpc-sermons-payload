import type { Block } from 'payload/types'

import linkTile from '../../fields/linkTile'
import richText from '../../fields/richText'

export const LinkTileList: Block = {
  slug: 'linkTileList',
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
      required: false,
    }),
    {
      name: 'linkTiles',
      type: 'array',
      label: 'Link Tile',
      fields: [linkTile({})],
    },
    {
      name: 'paddingBottom',
      type: 'select',
      options: [
        { label: 'Large', value: 'large' },
        { label: 'Medium', value: 'medium' },
        { label: 'None', value: 'none' },
      ],
    },
  ],
}
