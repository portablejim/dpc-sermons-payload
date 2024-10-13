import type { GlobalConfig } from 'payload/types'

export const Settings: GlobalConfig = {
  slug: 'settings',
  typescript: {
    interface: 'Settings',
  },
  graphQL: {
    name: 'Settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'videoSermonsPage',
      type: 'relationship',
      relationTo: 'pages',
      label: 'Video Sermons List page',
    },
    {
      name: 'audioSermonsPage',
      type: 'relationship',
      relationTo: 'pages',
      label: 'Audio Sermons List page',
    },
  ],
}
