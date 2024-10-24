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
}
