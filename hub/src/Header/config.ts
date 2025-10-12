import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
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
    afterChange: [revalidateHeader],
  },
}
