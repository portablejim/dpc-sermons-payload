import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Series as SeriesType } from '@/payload-types'
import { SeriesShow } from '../../../../components/SeriesShow'

import { generateSeriesMeta } from '@/utilities/generateMeta'
import notFound from '../../not-found'
import { getStaticFile } from '@/utilities/getStaticFile'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const url = '/' + slug

  if (!slug) {
    return notFound()
  }

  let series: SeriesType | null
  series = await querySeriesBySlug({
    slug,
  })

  if (!series) {
    return <PayloadRedirects url={url} />
  }

  let fallbackImageUrlSvg = getStaticFile('dpcPodcastGenericLogo_plain.svg')
  let fallbackImageUrlPng = getStaticFile('dpcPodcastGenericLogo_plain.png')

  return (
    <>
      <div className="container">
        <SeriesShow
          targetSeries={series}
          fallbackSvg={fallbackImageUrlSvg}
          fallbackPng={fallbackImageUrlPng}
        />
      </div>
    </>
  )
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params: paramsPromise }): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const page = await querySeriesBySlug({
    slug,
  })

  return generateSeriesMeta({ doc: page })
}

const querySeriesBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayloadHMR({ config: configPromise })

  const result = await payload.find({
    collection: 'series',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
