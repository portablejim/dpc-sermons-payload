import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
        {
          name: 'activeUrlMatch',
          label: 'Active URl Matches',
          type: 'array',
          fields: [
            {
              name: 'regex',
              type: 'text',
            },
          ],
        },
      ],
      maxRows: 30,
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
