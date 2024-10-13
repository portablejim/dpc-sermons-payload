import { slateEditor } from '@payloadcms/richtext-slate'
import path from 'path'
import type { CollectionConfig } from 'payload/types'

export const TalkAudio: CollectionConfig = {
  slug: 'talk-audio',
  upload: {
    staticDir: path.resolve(__dirname, '../../../talkaudio'),
    mimeTypes: ['audio/*'],
  },
  access: {
    read: () => true,
  },
  admin: {
    group: 'Media',
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
