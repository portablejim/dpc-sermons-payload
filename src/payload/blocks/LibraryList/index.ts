import type { Block } from 'payload/types'

export const LibraryList: Block = {
  slug: 'libraryList',
  labels: {
    plural: 'Sermon Library Blocks',
    singular: 'Sermon Library Block',
  },
  fields: [
    {
      name: 'mediaType',
      label: 'Media Type',
      type: 'select',
      options: [
        {
          label: 'Video',
          value: 'video',
        },
        {
          label: 'Audio',
          value: 'audio',
        },
      ],
    },
  ],
}
