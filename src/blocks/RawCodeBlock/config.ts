import type { Block } from 'payload'

export const RawCodeBlock: Block = {
  slug: 'raw-code-block',
  labels: {
    singular: 'Raw HTML/CSS Code Block',
    plural: 'Raw HTML/CSS Code Blocks',
  },
  fields: [
    {
      name: 'cssCode',
      label: 'Code (CSS)',
      type: 'code',
      admin: {
        language: 'css',
      },
    },
    {
      name: 'bodyCode',
      label: 'Code (Body)',
      type: 'code',
      admin: {
        language: 'html',
      },
    },
    {
      name: 'limitWidth',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
