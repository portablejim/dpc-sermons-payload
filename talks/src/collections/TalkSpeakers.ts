import { ensureGuid } from '@/hooks/ensureGuid'
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
      hooks: {
        beforeValidate: [ensureGuid]
      }
    },
    {
      name: 'talks',
      type: 'join',
      collection: 'episodes',
      on: 'speaker',
    },
  ],
}

export default TalkSpeakers
