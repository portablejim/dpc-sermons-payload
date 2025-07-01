import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: {
    useAPIKey: true
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'isConfiguringBooks',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  timestamps: true,
}

export default Users
