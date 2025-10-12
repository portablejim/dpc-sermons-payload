import React from 'react'

import { SeedButton } from './SeedButton'
import configPromise from '@payload-config'
import './index.scss'
import { Gutter } from '@payloadcms/ui'
import { getPayload } from 'payload'

const baseClass = 'books-seed-section'

export const SeedBible: React.FC = async () => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'bible-books',
    limit: 1,
    where: {},
  })

  const totalBooks = result.totalDocs
  console.log({ result })

  if (totalBooks > 0) {
    return <></>
  } else {
    return (
      <div className={baseClass}>
        <Gutter>
          <SeedButton />
        </Gutter>
      </div>
    )
  }
}
