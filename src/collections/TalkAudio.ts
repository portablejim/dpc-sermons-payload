import { getPayload, type CollectionConfig } from 'payload'
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
    useAsTitle: 'originalFilename',
  },
  hooks: {
    beforeOperation: [
      async (req) => {
        if (req.operation === 'create') {
          if (req.req.data && req.req.data.uuid == undefined) {
            req.req.data.guid = crypto.randomUUID()
          }
          if (req.req?.file?.name != undefined && req.req?.file?.name != null) {
            let filenameExtension =
              req.req.file.name.substring(
                req.req.file.name.lastIndexOf('.') + 1,
                req.req.file.name.length,
              ) || ''
            if (req.req.data) {
              req.req.data.originalFilename = req.req.file.name
              req.req.file.name = req.req?.data?.guid + '.' + filenameExtension
            }
          }
          let payload = getPayload({ config })
          ;(await payload).logger.info({
            stage: 'beforeOp',
            reqData: req.req.data,
            reqFile: req.req.file,
          })
        }
      },
    ],
    beforeChange: [
      ({ collection, context, data, req }) => {
        req.payload.logger.info({ stage: 'beforeChange', context, data })
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
      type: 'text',
      required: false,
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
        beforeValidate: [
          ({ data, req }) => {
            req.payload.logger.info({ stage: 'beforeGuidValidate1', data })
          },
          ensureGuid,
          ({ data, req }) => {
            req.payload.logger.info({ stage: 'beforeGuidValidate2', data })
          },
        ],
      },
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/talkaudio'),
    mimeTypes: ['audio/*'],
  },
}
