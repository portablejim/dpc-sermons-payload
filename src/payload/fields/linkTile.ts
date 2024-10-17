import type { Field } from 'payload/types'

import deepMerge from '../utilities/deepMerge'

export const appearanceOptions = {
  primary: {
    label: 'Primary Button',
    value: 'primary',
  },
  secondary: {
    label: 'Secondary Button',
    value: 'secondary',
  },
  default: {
    label: 'Default',
    value: 'default',
  },
}

export type LinkAppearances = 'primary' | 'secondary' | 'default'

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  overrides?: Record<string, unknown>
}) => Field

const linkTile: LinkType = ({ overrides = {} } = {}) => {
  const linkResult: Field = {
    name: 'linkTile',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
      },
      {
        name: 'subtitle',
        type: 'text',
      },
      {
        name: 'backgroundImage',
        type: 'upload',
        relationTo: 'cover-images',
        required: true,
      },
      {
        name: 'overlayColour',
        type: 'text',
        label: 'Overlay Colour',
      },
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
              {
                label: 'Link to Media/Document',
                value: 'mediaReference',
              },
            ],
            defaultValue: 'reference',
            admin: {
              layout: 'horizontal',
              width: '60%',
            },
          },
          {
            name: 'newTab',
            label: 'Open in new tab',
            type: 'checkbox',
            admin: {
              width: '40%',
              style: {
                alignSelf: 'flex-end',
              },
            },
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      label: 'Page to link to',
      type: 'relationship',
      relationTo: ['pages'],
      required: true,
      maxDepth: 1,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
    },
    {
      name: 'url',
      label: 'Custom URL',
      type: 'text',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
    },
    {
      name: 'linkedMedia',
      label: 'Media/Document',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'mediaReference',
      },
    },
  ]

  linkResult.fields = [...linkResult.fields, ...linkTypes]

  return deepMerge(linkResult, overrides)
}

export default linkTile
