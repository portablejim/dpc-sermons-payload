import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { draftMode, headers } from 'next/headers'
import React, { cache } from 'react'

import type { Page as PageType } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { getPayload } from 'payload'
import { SetNav } from '@/Header/SetNav'
import Link from 'next/link'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'members-hub' } = await paramsPromise
  const url = '/' + slug

  const pageHeaders = await headers()
  const erasePath = pageHeaders.get('X-Erase-Path') === '1'

 const page: PageType | null = await queryPageBySlug({
    slug,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { layout, title } = page

  const primaryNavText = 'members-hub'
  const secondaryNavText: string | null = null

  let backLink = <></>
  if(slug !== "members-hub") {
    backLink = <div className="container">
      <Link href={'./'} className={'pb-4 mb-2 inline-block capitalize'}>
        <svg className={"backlinkIcon icon w-5 dark:fill-white inline-block align-middle pr-1"} aria-label={"Back"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-providedby="Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.">
          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
        Members Hub
      </Link>
    </div>
  }

  return (
    <article className="pt-8 pb-16">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />
      {backLink}
      <div className="container">
        <h1 className="text-xl md:text-3xl">{title}</h1>
      </div>
      <SetNav primaryNav={primaryNavText} secondaryNav={secondaryNavText} />

      <RenderBlocks blocks={layout} erasePrefix={erasePath} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
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
