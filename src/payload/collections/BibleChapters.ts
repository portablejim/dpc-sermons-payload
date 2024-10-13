import type { CollectionConfig } from 'payload/types'

const BibleChapters: CollectionConfig = {
  slug: 'bible-chapters',
  timestamps: false,
  versions: false,
  defaultSort: 'globalOrder',
  admin: {
    useAsTitle: 'name',
    group: 'Bible',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.isConfiguringBooks === true,
    delete: ({ req: { user } }) => user?.isConfiguringBooks === true,
    update: ({ req: { user } }) => user?.isConfiguringBooks === true,
  },
  fields: [
    {
      name: 'book',
      type: 'relationship',
      relationTo: 'bible-books',
      required: true,
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'order',
      type: 'number',
      required: true,
    },
    {
      name: 'globalOrder',
      type: 'number',
      required: true,
      unique: true,
    },
    {
      name: 'shortName',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'hasNoChapters',
      label: 'Book has no chapters',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'verses',
      type: 'number',
      required: true,
    },
  ],
}

export default BibleChapters
