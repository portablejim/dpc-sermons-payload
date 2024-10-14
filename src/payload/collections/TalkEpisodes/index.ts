import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { adminsOrPublished } from '../../access/adminsOrPublished'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidatePost } from './hooks/revalidatePost'

export const TalkEpisodes: CollectionConfig = {
  slug: 'episodes',
  labels: {
    singular: 'Bible Talk',
    plural: 'Bible Talks',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Sermons',
    defaultColumns: ['title', 'sermonDate', 'series'],
    preview: doc => {
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/next/preview?url=${encodeURIComponent(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/posts/${doc?.slug}`,
      )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
    },
  },
  defaultSort: 'sermonDate',
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: adminsOrPublished,
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
      name: 'series',
      type: 'relationship',
      relationTo: 'series',
    },
    {
      name: 'biblePassageText',
      label: 'Bible Passage (text)',
      type: 'text',
    },
    {
      name: 'speaker',
      type: 'relationship',
      relationTo: 'speakers',
    },
    {
      name: 'sermonDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'episodeImage',
      label: 'Episode Image',
      type: 'upload',
      relationTo: 'cover-images',
      filterOptions: {
        mimeType: { contains: 'image' },
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'videoFormat',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Embedded Player',
          value: 'embed',
        },
        {
          label: 'None',
          value: 'none',
        },
      ],
      defaultValue: 'embed',
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.videoFormat === 'embed',
      },
    },
    {
      name: 'audioFormat',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Linked',
          value: 'linked',
        },
      ],
      defaultValue: 'linked',
    },
    {
      name: 'audioUrl',
      type: 'text',
    },
    {
      name: 'talkOutline',
      type: 'richText',
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

            if (data.sermonDate && data.title) {
              const titleSlug = slugFormat(data.title)
              const dateSlug = data.sermonDate.substring(0, 10)
              return `${dateSlug}-${titleSlug}`
            }

            return value
          },
        ],
      },
    },
  ],
}
