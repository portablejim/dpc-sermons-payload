import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { ensureGuid } from '@/hooks/ensureGuid'
import { coverImage } from '@/endpoints/coverImageHandler'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const CoverImages: CollectionConfig = {
  slug: 'cover-images',
  labels: {
    plural: 'Cover Images',
    singular: 'Cover Image',
  },
  admin: {
    group: 'Media',
    useAsTitle: 'alt',
  },
  upload: {
    staticDir: path.resolve(dirname, '../../public/upload/cover-images'),
    mimeTypes: ['image/*'],
    focalPoint: true,
    crop: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 128,
        height: 128,
        position: 'left bottom',
        withoutEnlargement: true,
      },
      {
        name: 'thumbnail_webp',
        width: 128,
        height: 128,
        position: 'left bottom',
        withoutEnlargement: true,
        formatOptions: {
          format: 'webp',
        },
      },
      {
        name: 'thumbnail_large',
        width: 256,
        height: 256,
        position: 'left bottom',
        withoutEnlargement: true,
        formatOptions: {
          format: 'webp',
        },
      },
      {
        name: 'card',
        width: 1024,
        height: 576,
        position: 'left bottom',
        withoutEnlargement: true,
      },
      {
        name: 'card_webp',
        width: 1024,
        height: 576,
        position: 'left bottom',
        withoutEnlargement: true,
        formatOptions: {
          format: 'webp',
        },
      },
      {
        name: 'card_large',
        width: 1920,
        height: 1080,
        position: 'left bottom',
        withoutEnlargement: true,
        formatOptions: {
          format: 'webp',
        },
      },
      {
        name: 'largeSquare',
        width: 1500,
        height: 1500,
        position: 'left bottom',
        withoutEnlargement: false,
        formatOptions: {
          format: 'jpeg',
          options: {
            mozjpeg: true,
          },
        },
      },
    ],
    resizeOptions: {
      position: 'left bottom',
    },
  },
  endpoints: [
    {
      path: '/byVersion/:id/:versionId/:type/:filename',
      method: 'get',
      handler: coverImage,
    },
  ],
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: false,
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'purpose',
      type: 'select',
      hasMany: true,
      label: 'Image Purpose',
      options: [
        {
          label: 'Hub Image',
          value: 'hub-image',
        },
        {
          label: 'Sermon Series Image',
          value: 'series-image',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ]
    },
    {
      name: 'version',
      type: 'number',
      defaultValue: 1,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (typeof value === 'number') {
              return value + 1
            }

            return value
          },
        ],
      },
    },
    {
      name: 'guid',
      type: 'text',
      label: 'GUID',
      unique: true,
      index: true,
      hidden: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [ensureGuid],
      },
    },
    {
      name: 'sha1sum',
      label: 'SHA1 Hash',
      type: 'text',
      hidden: true,
    },
    {
      name: 'hashInvalid',
      type: 'checkbox',
      defaultValue: false,
      hidden: true,
    },
    {
      name: 'squareSvg',
      label: 'Square SVG (Override)',
      type: 'upload',
      relationTo: 'cover-image-svgs',
      admin: {
        description: 'A square SVG of the image to use instead',
      },
    },
    {
      name: 'cardSvg',
      label: 'Card SVG (Override)',
      type: 'upload',
      relationTo: 'cover-image-svgs',
      admin: {
        description: 'A 16:9 SVG of the image to use instead',
      },
    },
  ],
}
