import type { Block } from 'payload'

import linkTile from '../../fields/linkTile'
import { lexicalEditor, HeadingFeature, FixedToolbarFeature, InlineToolbarFeature } from '@payloadcms/richtext-lexical'

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
    {
      name: 'description',
      label: 'Description',
      required: false,
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
    },
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
