import { getPayload, type CollectionConfig, FieldHookArgs } from 'payload'
import config from '@payload-config'

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
import { getFileData } from '@/hooks/getFileData'
import { TalkAudio as TalkAudioType } from '@/payload-types'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const TalkAudio: CollectionConfig = {
  slug: 'talk-audio',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Media',
    useAsTitle: 'alt',
  },
  hooks: {
    beforeOperation: [
      (req) => {
        if (req.operation === 'create') {
          if (req.req.data && (req.req.data.guid == undefined || req.req.data.guid == null)) {
            req.req.data.guid = crypto.randomUUID()
          }
          if (req.req?.file?.name != undefined && req.req?.file?.name != null) {
            const filenameExtension =
              req.req.file.name.substring(
                req.req.file.name.lastIndexOf('.') + 1,
                req.req.file.name.length,
              ) || ''
            if (req.req.data) {
              req.req.data.originalFilename = req.req.file.name
              req.req.file.name = req.req?.data?.guid + '.' + filenameExtension
            }
          }
        }
      },
    ],
    afterChange: [getFileData],
  },
  fields: [
    {
      name: 'originalFilename',
      type: 'text',
      required: false,
    },
    {
      name: 'alt',
      label: 'Name',
      type: 'text',
      required: false,
      hooks: {
        beforeValidate: [
          ({data, value}: FieldHookArgs<TalkAudioType, string, string>) => {
            if((!value || value.length === 0) && data && data.originalFilename && data.originalFilename.length > 0) {
              return data.originalFilename
            }
          }
        ]
      }
    },
    {
      name: 'uploadQuality',
      type: 'select',
      options: [
        { label: 'Best (AIFF / FLAC / High bitrate file)', value: 'best' },
        { label: 'Good (Regular MP3 file)', value: 'good' },
        { label: 'Medium', value: 'medium' },
        { label: 'Low / Dialup', value: 'low' },
      ],
      defaultValue: 'good',
    },
    {
      name: 'lengthSeconds',
      label: 'Length (Seconds)',
      type: 'number',
      hidden: true,
    },
    {
      name: 'lengthDisplay',
      label: 'Length (Time)',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Initial', value: 'initial' },
        { label: 'Processing', value: 'processing' },
        { label: 'Ready', value: 'ready' },
      ],
      defaultValue: 'initial',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'qualityGoodMp3_filename',
      type: 'text',
      hidden: true,
    },
    {
      name: 'qualityGoodMp3_mimetype',
      type: 'text',
      hidden: true,
    },
    {
      name: 'qualityGoodMp3_filesize',
      type: 'number',
      hidden: true,
    },
    {
      name: 'qualityGoodOpus_filename',
      type: 'text',
      hidden: true,
    },
    {
      name: 'qualityGoodOpus_mimetype',
      type: 'text',
      hidden: true,
    },
    {
      name: 'qualityGoodOpus_filesize',
      type: 'number',
      hidden: true,
    },
    {
      name: 'qualityMediumMp3_filename',
      type: 'text',
      hidden: true,
    },
    {
      name: 'qualityMediumMp3_mimetype',
      type: 'text',
      hidden: true,
    },
    {
      name: 'qualityMediumMp3_filesize',
      type: 'number',
      hidden: true,
    },
    {
      name: 'qualityMediumOpus_filename',
      type: 'text',
      hidden: true,
    },
    {
      name: 'qualityMediumOpus_mimetype',
      type: 'text',
      hidden: true,
    },
    {
      name: 'qualityMediumOpus_filesize',
      type: 'number',
      hidden: true,
    },
    {
      name: 'qualityLowMp3_filename',
      type: 'text',
      hidden: true,
    },
    {
      name: 'qualityLowMp3_mimetype',
      type: 'text',
      hidden: true,
    },
    {
      name: 'qualityLowMp3_filesize',
      type: 'number',
      hidden: true,
    },
    {
      name: 'qualityLowOpus_filename',
      type: 'text',
      hidden: true,
    },
    {
      name: 'qualityLowOpus_mimetype',
      type: 'text',
      hidden: true,
    },
    {
      name: 'qualityLowOpus_filesize',
      type: 'number',
      hidden: true,
    },
    {
      name: 'guid',
      type: 'text',
      label: 'GUID',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [ensureGuid],
      },
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/upload/talkaudio'),
    mimeTypes: ['audio/*'],
  },
}
