import type { CollectionConfig } from 'payload'

import type { Series } from '@/payload-types'
import { authenticated } from '@/access/authenticated'
import { ensureGuid } from '@/hooks/ensureGuid'
import { revalidateSeries } from '@/utilities/revalidateSeries'

const getExpandedTitle = (doc): string => {
  if (typeof doc.subtitle === 'string' && doc.subtitle.trim().length > 0) {
    return `${doc.title} (${doc.subtitle})`
  } else {
    return doc.title
  }
}
const getSlug = (doc: Series): string => setSlugField({ value: doc.slug, data: doc })

const setSlugField = ({ value, data }: { value?: string; data?: unknown }): string => {
  const slugFormat = (val: string): string =>
    val
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
      .toLowerCase()
  const dataIsObject = data !== null &&
    typeof data === 'object' &&
    'id' in data &&
    'seriesDate' in data &&
    'title' in data
  if (dataIsObject &&
    data.id !== undefined &&
    data.id !== null &&
    value !== undefined &&
    value !== null &&
    typeof value === 'string' &&
    value.trim().length > 1
  ) {
    return slugFormat(value)
  }

  if (dataIsObject && typeof data.seriesDate === 'string' && typeof data.title === 'string') {
    const titleSlug = slugFormat(data.title)
    const dateSlug = data.seriesDate.substring(2, 7)
    return `${dateSlug}-${titleSlug}`
  } else if (dataIsObject && typeof data.title === 'string') {
    const titleSlug = slugFormat(data.title)
    //const dateSlug = data.seriesDate.toISOString().substring(2, 7)
    return `${titleSlug}`
  }

  return value || ''
}

const TalkSeries: CollectionConfig = {
  slug: 'series',
  admin: {
    useAsTitle: 'expandedTitle',
    group: 'Sermons',
  },
  access: {
    //read: () => true,
    read: () => true,
    update: authenticated,
    create: authenticated,
    delete: authenticated,
  },
  hooks: {
    afterChange: [revalidateSeries],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'seriesType',
      label: 'Type',
      type: 'select',
      options: [
        { label: 'Regular Sunday', value: 'regular' },
        { label: 'Special Event', value: 'special' },
      ],
      defaultValue: 'regular',
    },
    {
      name: 'seriesDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
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
    /*
    {
      name: 'fake1',
      type: 'ui',
      admin: {
        components: {
          Field: buildDependentFieldUpdater(
            'expandedTitle',
            ['title', 'subtitle'],
            getExpandedTitle,
          ),
        },
      },
    },
    {
      name: 'fake2',
      type: 'ui',
      admin: {
        components: {
          Field: buildDependentFieldUpdater('slug', ['title', 'seriesDate'], getSlug),
        },
      },
    },
    */
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [setSlugField],
      },
    },
    {
      name: 'expandedTitle',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data) {
              if (data && data.title && data.subtitle) {
                return `${data.title} (${data.subtitle})`
              }
              return data?.title
            }

            return ''
          },
        ],
      },
    },
    {
      name: 'episodes',
      type: 'join',
      collection: 'episodes',
      on: 'series',
    },
    {
      name: 'guid',
      type: 'text',
      label: 'GUID',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [ensureGuid],
      },
    },
  ],
}

export default TalkSeries
