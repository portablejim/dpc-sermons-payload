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
import { open, openSync, readFileSync } from 'fs'
import { ensureGuid } from '@/hooks/ensureGuid'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
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
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
  },
  endpoints: [
    {
      method: 'get',
      path: '/preview/:id',
      handler: async (req) => {
        if(typeof req?.routeParams?.id != 'string') {
          return Response.error()
        }
        let mediaFind = await req.payload.findByID({
          collection: 'media',
          id: req.routeParams.id
        })
        if(typeof mediaFind.filename != 'string') {
          return Response.error()
        }
        let filePath = path.resolve(dirname, '../../public/media', mediaFind.filename)
        let mediaBody = readFileSync(filePath)
        let fileNameSafe = encodeURIComponent(mediaFind.filename)
        return new Response(mediaBody, {
          headers: new Headers({
            'content-type': mediaFind.mimeType ?? '',
            'content-disposition': `inline; filename*=UTF-8''${fileNameSafe}`,
          }),
        })
      }
    },
    {
      method: 'get',
      path: '/download/:id',
      handler: async (req) => {
        if(typeof req?.routeParams?.id != 'string') {
          return Response.error()
        }
        let mediaFind = await req.payload.findByID({
          collection: 'media',
          id: req.routeParams.id
        })
        if(typeof mediaFind.filename != 'string') {
          return Response.error()
        }
        let filePath = path.resolve(dirname, '../../public/media', mediaFind.filename)
        let mediaBody = readFileSync(filePath)
        let fileNameSafe = encodeURIComponent(mediaFind.filename)
        return new Response(mediaBody, {
          headers: new Headers({
            'content-type': mediaFind.mimeType ?? '',
            'content-disposition': `attachment; filename*=UTF-8''${fileNameSafe}`,
          }),
        })
      }
    },
  ],
}
