import type { Block } from 'payload'

export const LibraryList: Block = {
  slug: 'libraryList',
  labels: {
    plural: 'Sermon Library Blocks',
    singular: 'Sermon Library Block',
  },
  fields: [
    {
      name: 'episodeType',
      label: 'Type',
      type: 'select',
      options: [
        { label: 'Regular Sunday', value: 'regular' },
        { label: 'Special Event', value: 'special' },
      ],
      defaultValue: 'regular',
    },
  ],
}
