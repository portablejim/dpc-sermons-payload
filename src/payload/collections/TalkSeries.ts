import type { CollectionConfig } from 'payload/types'

import { admins } from '../access/admins'
import buildDependentFieldUpdater from '../components/buildDependantFieldUpdater'
import type { Series } from '../payload-types'

const getExpandedTitle = (doc): string => {
  if (typeof doc.subtitle === 'string' && doc.subtitle.trim().length > 0) {
    return `${doc.title} (${doc.subtitle})`
  } else {
    return doc.title
  }
}
const getSlug = (doc: Series): string => setSlugField({ value: doc.slug, data: doc })

const setSlugField = ({ value, data }: { value?: any; data?: any }): string => {
  const slugFormat = (val: string): string =>
    val
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
      .toLowerCase()
  if (
    data.id !== undefined &&
    data.id !== null &&
    value !== undefined &&
    value !== null &&
    typeof value === 'string' &&
    value.trim().length > 1
  ) {
    return slugFormat(value)
  }

  if (typeof data.seriesDate === 'string' && typeof data.title === 'string') {
    const titleSlug = slugFormat(data.title)
    const dateSlug = data.seriesDate.substring(2, 7)
    return `${dateSlug}-${titleSlug}`
  } else if (typeof data.seriesDate === 'object' && typeof data.title === 'string') {
    const titleSlug = slugFormat(data.title)
    const dateSlug = data.seriesDate.toISOString().substring(2, 7)
    return `${dateSlug}-${titleSlug}`
  }

  return value
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
    update: admins,
    create: admins,
    delete: admins,
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
      name: 'seriesDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
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
            if (data.subtitle) {
              return `${data.title} (${data.subtitle})`
            }

            return data.title
          },
        ],
      },
    },
  ],
}

export default TalkSeries
