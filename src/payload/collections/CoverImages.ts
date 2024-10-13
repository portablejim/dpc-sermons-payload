import { slateEditor } from '@payloadcms/richtext-slate'
import path from 'path'
import type { CollectionConfig } from 'payload/types'

export const CoverImages: CollectionConfig = {
  slug: 'cover-images',
  labels: {
    plural: 'Cover Images',
    singular: 'Cover Image',
  },
  admin: {
    group: 'Media',
  },
  upload: {
    staticDir: path.resolve(__dirname, '../../../cover-images'),
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
    ],
    resizeOptions: {
      position: 'left bottom',
    },
  },
  access: {
    read: () => true,
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
      editor: slateEditor({
        admin: {
          elements: ['link'],
        },
      }),
    },
  ],
}
