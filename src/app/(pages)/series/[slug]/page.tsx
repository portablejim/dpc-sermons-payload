import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import payload from 'payload'

import {
  CoverImage,
  Episode,
  Page as PageType,
  Series as SeriesType,
} from '../../../../payload/payload-types'
import { fetchDoc } from '../../../_api/fetchDoc'
import { fetchDocs } from '../../../_api/fetchDocs'
import { fetchSeries } from '../../../_api/fetchSeries'
import { Gutter } from '../../../_components/Gutter'
import { Image } from '../../../_components/Media/Image'
import { SeriesShow } from '../../../_components/SeriesShow'
import { generateMeta } from '../../../_utilities/generateMeta'

// Payload Cloud caches all files through Cloudflare, so we don't need Next.js to cache them as well
// This means that we can turn off Next.js data caching and instead rely solely on the Cloudflare CDN
// To do this, we include the `no-cache` header on the fetch requests used to get the data for this page
// But we also need to force Next.js to dynamically render this page on each request for preview mode to work
// See https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
// If you are not using Payload Cloud then this line can be removed, see `../../../README.md#cache`
export const dynamic = 'force-dynamic'

export default async function Page({ params: { slug = 'home' } }) {
  const { isEnabled: isDraftMode } = draftMode()

  let page: PageType | null = null
  let series: (SeriesType & { episodes: Episode[] }) | null = null

  try {
    page = await fetchDoc<PageType>({
      collection: 'pages',
      slug: 'home',
      draft: isDraftMode,
    })
    payload.logger.info('fetching series')
    series = await fetchSeries<SeriesType>({
      slug,
    })
  } catch (error) {
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // so swallow the error here and simply render the page with fallback data where necessary
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    // console.error(error)
    payload.logger.info({ error })
    throw error
  }

  if (!series) {
    return notFound()
  }

  return (
    <>
      <Gutter>
        <SeriesShow targetSeries={series} />
      </Gutter>
    </>
  )
}

export async function generateStaticParams() {
  try {
    const pages = await fetchDocs<PageType>('pages')
    return pages?.map(({ slug }) => slug)
  } catch (error) {
    return []
  }
}

export async function generateMetadata({ params: { slug = 'home' } }): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode()

  let page: PageType | null = null

  try {
    page = await fetchDoc<PageType>({
      collection: 'pages',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {
    // don't throw an error if the fetch fails
    // this is so that we can render static fallback pages for the demo
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    throw error
  }

  return generateMeta({ doc: page })
}
