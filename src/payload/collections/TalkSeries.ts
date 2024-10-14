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
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const slugFormat = (val: string): string =>
              val
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
                .toLowerCase()
            if (typeof value === 'string' && value.trim().length > 1) {
              return slugFormat(value)
            }

            if (data.seriesDate && data.title) {
              const titleSlug = slugFormat(data.title)
              const dateSlug = data.seriesDate.substring(2, 7)
              return `${dateSlug}-${titleSlug}`
            }

            return value
          },
        ],
      },
    },
  ],
}

export default TalkSeries
