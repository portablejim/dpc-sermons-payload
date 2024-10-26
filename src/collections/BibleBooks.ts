import type { CollectionConfig } from 'payload'

const BibleBooks: CollectionConfig = {
  slug: 'bible-books',
  timestamps: false,
  versions: false,
  admin: {
    useAsTitle: 'name',
    group: 'Bible',
    pagination: {
      defaultLimit: 70,
    },
  },
  defaultSort: 'order',
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.isConfiguringBooks === true,
    delete: ({ req: { user } }) => user?.isConfiguringBooks === true,
    update: ({ req: { user } }) => user?.isConfiguringBooks === true,
  },
  fields: [
    {
      name: 'id',
      type: 'number'
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
  ],
}

export default BibleBooks
