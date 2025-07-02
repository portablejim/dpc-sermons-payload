import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Series as SeriesType } from '@/payload-types'
import { SeriesShow } from '../../../../components/SeriesShow'

import { generateSeriesMeta } from '@/utilities/generateMeta'
import notFound from '../../not-found'
import { getStaticFile } from '@/utilities/getStaticFile'
import { getPayload } from 'payload'

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

  const series: SeriesType | null = await querySeriesBySlug({
    slug,
  })

  if (!series) {
    return <PayloadRedirects url={url} />
  }

  const fallbackImageUrlSvg = getStaticFile('dpcPodcastGenericLogo_plain.svg')
  const fallbackImageUrlPng = getStaticFile('dpcPodcastGenericLogo_plain.png')

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

export async function generateMetadata({ params: paramsPromise }): Promise<Metadata | null> {
  const { slug = 'home' } = await paramsPromise
  const page = await querySeriesBySlug({
    slug,
  })

  return page !== null ? generateSeriesMeta({ doc: page }) : null
}

const querySeriesBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

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

  if(result.docs.length < 1) {
    return null;
  }

  const resultDoc = result.docs[0]

  const episodesList = await payload.find({
    collection: 'episodes',
    where: {
      series: {
        equals: resultDoc.id
      }
    },
    sort: "-sermonDate",
  })
  if(episodesList != undefined) {
    resultDoc.episodes = episodesList
  }

  return resultDoc
})
