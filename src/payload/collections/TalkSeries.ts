import type { CollectionConfig } from 'payload/types'

const TalkSeries: CollectionConfig = {
  slug: 'series',
  admin: {
    useAsTitle: 'title',
    group: 'Sermons',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'seriesDate',
      type: 'date',
    },
    {
      name: 'seriesImage',
      type: 'upload',
      relationTo: 'cover-images',
      required: true,
      filterOptions: {
        mimeType: { contains: 'image' },
      },
    },
  ],
}

export default TalkSeries
