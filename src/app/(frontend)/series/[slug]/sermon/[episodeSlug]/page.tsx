import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import payload from 'payload'

import {
  CoverImage,
  Episode,
  Episode as EpisodeType,
  Page as PageType,
  Series as SeriesType,
} from '../../../../../../payload/payload-types'
import { fetchEpisode } from '../../../../../_api/fetchEpisode'
import { EpisodeShow } from '../../../../../_components/EpisodeShow'
import { Gutter } from '../../../../../_components/Gutter'

// Payload Cloud caches all files through Cloudflare, so we don't need Next.js to cache them as well
// This means that we can turn off Next.js data caching and instead rely solely on the Cloudflare CDN
// To do this, we include the `no-cache` header on the fetch requests used to get the data for this page
// But we also need to force Next.js to dynamically render this page on each request for preview mode to work
// See https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
// If you are not using Payload Cloud then this line can be removed, see `../../../README.md#cache`
export const dynamic = 'force-dynamic'

export default async function Page({ params: { slug, episodeSlug } }): Promise<JSX.Element> {
  let episode: Episode | null = null

  try {
    payload.logger.info('fetching series')
    episode = await fetchEpisode<EpisodeType>({
      slug: episodeSlug,
    })
  } catch (error) {
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // so swallow the error here and simply render the page with fallback data where necessary
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    // console.error(error)
    payload.logger.info({ error })
  }

  if (!episode) {
    return notFound()
  }

  return (
    <>
      <Gutter>
        <EpisodeShow targetEpisode={episode} />
      </Gutter>
    </>
  )
}
