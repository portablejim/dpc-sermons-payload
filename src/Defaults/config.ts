import type { GlobalConfig } from 'payload'

export const Defaults: GlobalConfig = {
  slug: 'defaults',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'defaultPage',
      label: 'Default page slug',
      type: 'text',
      defaultValue: 'home',
    },
    {
      name: 'defaultCoverImage',
      label: 'Default cover image',
      type: 'relationship',
      relationTo: 'cover-images',
    },
  ],
}
