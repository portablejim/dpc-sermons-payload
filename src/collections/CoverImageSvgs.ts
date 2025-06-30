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
import { coverImageSvg } from '@/endpoints/coverImageHandler'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const CoverImageSvgs: CollectionConfig = {
  slug: 'cover-image-svgs',
  labels: {
    plural: 'Cover Image SVGs',
    singular: 'Cover Image SVG',
  },
  admin: {
    group: 'Media',
    useAsTitle: 'alt',
  },
  upload: {
    staticDir: path.resolve(dirname, '../../public/upload/cover-image-svg'),
    mimeTypes: ['image/svg'],
    focalPoint: false,
    crop: false,
  },
  endpoints: [
    {
      path: '/byVersion/:id/:versionId/:filename',
      method: 'get',
      handler: coverImageSvg,
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
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'svgFocalPoint',
      type: 'select',
      options: [
        { label: 'Top Left', value: 'top-left' },
        { label: 'Top', value: 'top-center' },
        { label: 'Top Right', value: 'top-right' },
        { label: 'Left', value: 'center-left' },
        { label: 'Centre', value: 'center-center' },
        { label: 'Right', value: 'center-right' },
        { label: 'Bottom Left', value: 'bottom-left' },
        { label: 'Bottom', value: 'bottom-center' },
        { label: 'Bottom Right', value: 'bottom-right' },
      ],
      defaultValue: 'center-center',
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
  ],
}
