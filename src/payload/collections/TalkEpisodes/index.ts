import payload from 'payload'
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
    beforeValidate: [
      async ({
        data, // incoming data to update or create with
        operation, // name of the operation ie. 'create', 'update'
        originalDoc, // original document
      }) => {
        payload.logger.info(data)

        if (
          operation === 'create' ||
          data.fullTitle == null ||
          data.fullTitle.trim() == '' ||
          data.title != originalDoc.title ||
          data.series != originalDoc.series ||
          data.biblePassageText != originalDoc.biblePassageText ||
          data.sermonDate != originalDoc.sermonDate
        ) {
          let seriesTitle: null | string = null
          if (data.series) {
            let foundSeries = await payload.findByID({
              collection: 'series',
              id: data.series,
              depth: 1,
            })
            payload.logger.info(foundSeries)
            //sermonTitle = title != undefined ? title : null
          }
          let outputParts = []
          if (data.sermonDate) {
            payload.logger.info(data.sermonDate)
            const sermonDateYear = data.sermonDate.substring(2, 4)
            const sermonDateMonth = data.sermonDate.substring(5, 7)
            const sermonDateDay = data.sermonDate.substring(8, 10)
            payload.logger.info(sermonDateDay, sermonDateMonth, sermonDateYear)
            outputParts.push(`${sermonDateDay}/${sermonDateMonth}/${sermonDateYear}`)
          }
          if (data.title) {
            outputParts.push(data.title)
          } else {
            outputParts.push('(unknown)')
          }
          if (data.biblePassageText) {
            outputParts.push(data.biblePassageText)
          }
          if (seriesTitle) {
            outputParts.push(seriesTitle)
          }
          data.fullTitle = outputParts.join(' | ')
        }

        return data
      },
    ],
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
      name: 'biblePassages',
      labels: {
        singular: 'Bible Passage',
        plural: 'Bible Passage',
      },
      type: 'array',
      fields: [
        {
          name: 'chapter',
          type: 'relationship',
          relationTo: 'bible-chapters',
          admin: {
            allowCreate: false,
          },
        },
      ],
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
      required: true,
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
    {
      name: 'fullTitle',
      label: 'Full Title',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {},
    },
  ],
}
