import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Page as PageType } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { getPayload } from 'payload'
import { SetNav } from '@/Header/SetNav'

export async function generateStaticParams() {
  return []
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'main' } = await paramsPromise
  const fullSlug = 'talks-' + slug
  const url = '/-' + fullSlug

 const page: PageType | null = await queryPageBySlug({
    slug: fullSlug,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { layout, title } = page

  let primaryNavText = 'members-hub'
  let secondaryNavText: string | null = null
  if(
    slug === '' ||
    slug === 'main'
  ) {
    primaryNavText = 'talks'
    secondaryNavText = 'regular'
  }
  if(
    slug === 'other'
  ) {
    primaryNavText = 'talks'
    secondaryNavText = 'special'
  }

  return (
    <article className="pt-8 pb-16">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      <div className="container">
        <h1 className="text-xl md:text-3xl">{title}</h1>
      </div>
      <SetNav primaryNav={primaryNavText} secondaryNav={secondaryNavText} />

      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const fullSlug = 'talks-' + slug
  const page = await queryPageBySlug({
    slug: fullSlug,
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
