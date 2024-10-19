import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import payload from 'payload'

import { Page as PageType } from '../../../payload/payload-types'
import { fetchDoc } from '../../_api/fetchDoc'
import { fetchDocs } from '../../_api/fetchDocs'
import { Blocks } from '../../_components/Blocks'
import { Gutter } from '../../_components/Gutter'
import { generateMeta } from '../../_utilities/generateMeta'

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

  try {
    page = await fetchDoc<PageType>({
      collection: 'pages',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // so swallow the error here and simply render the page with fallback data where necessary
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    // console.error(error)
  }

  if (!page) {
    return notFound()
  }

  let PageHeading = ({ slug }) => {
    if (slug !== 'home') {
      return (
        <Gutter>
          <h1 className="pageHeading">{page.title}</h1>
        </Gutter>
      )
    }
    return <></>
  }

  const { layout } = page

  return (
    <React.Fragment>
      <PageHeading slug={slug} />
      <main>
        <Blocks blocks={layout} disableTopPadding={true} />
      </main>
    </React.Fragment>
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
