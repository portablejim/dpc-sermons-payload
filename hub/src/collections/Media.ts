import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { readFileSync } from 'fs'
import { ensureGuid } from '@/hooks/ensureGuid'

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
    //staticDir: path.resolve(dirname, '../../public/upload/media'),
    //staticDir: "public/upload/media",
    staticDir: path.resolve(process.env.APP_PUBLIC__DIR_PATH ?? 'public/', 'upload/media'),
  },
  endpoints: [
    {
      method: 'get',
      path: '/preview/:id',
      handler: async (req) => {
        if(typeof req?.routeParams?.id != 'string') {
          return Response.error()
        }
        const mediaFind = await req.payload.findByID({
          collection: 'media',
          id: req.routeParams.id
        })
        if(typeof mediaFind.filename != 'string') {
          return Response.error()
        }
        const filePath = path.resolve(process.env.APP_PUBLIC__DIR_PATH ?? 'public/', 'upload/media', mediaFind.filename)
        const mediaBody = readFileSync(filePath)
        const fileNameSafe = encodeURIComponent(mediaFind.filename)
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
        const mediaFind = await req.payload.findByID({
          collection: 'media',
          id: req.routeParams.id
        })
        if(typeof mediaFind.filename != 'string') {
          return Response.error()
        }
        const filePath = path.resolve(process.env.APP_PUBLIC__DIR_PATH ?? 'public/', 'upload/media', mediaFind.filename)
        const mediaBody = readFileSync(filePath)
        const fileNameSafe = encodeURIComponent(mediaFind.filename)
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
