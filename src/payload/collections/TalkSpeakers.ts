import type { CollectionConfig } from 'payload/types'

const TalkSpeakers: CollectionConfig = {
  slug: 'speakers',
  versions: false,
  admin: {
    useAsTitle: 'name',
    group: 'Sermons',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
}

export default TalkSpeakers
