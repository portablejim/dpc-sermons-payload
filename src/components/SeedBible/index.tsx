import React from 'react'

import { SeedButton } from './SeedButton'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import './index.scss'
import { Gutter } from '@payloadcms/ui'

const baseClass = 'books-seed-section'

export const SeedBible: React.FC = async () => {
  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'bible-books',
    limit: 1,
    where: {
    },
  });

  let totalBooks = result.totalDocs
  console.log({result})

  if(totalBooks > 0)
  {
    return <></>
  }
  else {
    return (
      <div className={baseClass}>
        <Gutter>
          <SeedButton />
        </Gutter>
      </div>
    )
  }
}
