import type { Block } from 'payload/types'

export const CodeBlock: Block = {
  slug: 'code-block',
  fields: [
    {
      name: 'bodyCode',
      label: 'Code (Body)',
      type: 'code',
    },
    {
      name: 'cssCode',
      label: 'Code (CSS)',
      type: 'code',
    },
  ],
}
