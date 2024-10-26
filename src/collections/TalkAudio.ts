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
  },
  fields: [
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
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/talkaudio'),
    mimeTypes: ['audio/*'],
  },
}
