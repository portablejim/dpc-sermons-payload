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
    staticDir: path.resolve(dirname, '../../public/cover-images'),
    mimeTypes: ['image/*'],
    focalPoint: true,
    crop: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 200,
        height: 200,
        position: 'left bottom',
        withoutEnlargement: true,
      },
      {
        name: 'card',
        width: 1024,
        height: 576,
        position: 'left bottom',
        withoutEnlargement: true,
      },
      {
        name: 'largeSquare',
        width: 1500,
        height: 1500,
        position: 'left bottom',
        withoutEnlargement: false,
      },
    ],
    resizeOptions: {
      position: 'left bottom',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
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
        beforeValidate: [ensureGuid]
      }
    },
  ],
}
