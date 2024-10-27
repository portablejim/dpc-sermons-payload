import type { CollectionConfig } from 'payload'

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
    {
      name: 'guid',
      type: 'text',
      label: 'GUID',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      defaultValue: () => crypto.randomUUID()
    },
  ],
}

export default TalkSpeakers
