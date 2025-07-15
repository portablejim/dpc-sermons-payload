import React, { cache } from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import payload, { getPayload } from 'payload'

import { Episode } from '@/payload-types'
import { EpisodeShow } from '../../../../../components/EpisodeShow'
import configPromise from '@payload-config'
import { generateEpisodeMeta } from '@/utilities/generateMeta'
import { getStaticFile } from '@/utilities/getStaticFile'

// Payload Cloud caches all files through Cloudflare, so we don't need Next.js to cache them as well
// This means that we can turn off Next.js data caching and instead rely solely on the Cloudflare CDN
// To do this, we include the `no-cache` header on the fetch requests used to get the data for this page
// But we also need to force Next.js to dynamically render this page on each request for preview mode to work
// See https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
// If you are not using Payload Cloud then this line can be removed, see `../../../README.md#cache`
export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    slug: string
    episodeSlug: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { episodeSlug } = await paramsPromise
  let episode: Episode | null = null

  try {
    episode = await queryEpisodeBySlug({
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

  if (typeof episode.series !== 'number' && episode.series?.slug) {
    return redirect(`../series/${episode.series.slug}/sermon/${episode.slug}`)
  }

  const fallbackSvg = getStaticFile('dpcPodcastGenericLogo_plain.svg')
  const fallbackPng = getStaticFile('dpcPodcastGenericLogo_plain.png')

  return (
    <>
      <div className="container">
        <EpisodeShow targetEpisode={episode} fallbackSvg={fallbackSvg} fallbackPng={fallbackPng} />
      </div>
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }): Promise<Metadata> {
  const { episodeSlug = '' } = await paramsPromise
  const page = await queryEpisodeBySlug({
    slug: episodeSlug,
  })

  return generateEpisodeMeta({ doc: page })
}

const queryEpisodeBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'episodes',
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
