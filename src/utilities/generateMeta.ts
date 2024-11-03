import type { Metadata } from 'next'

import type { Episode, Page, Series } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'

export const generateMeta = async (args: { doc: Page }): Promise<Metadata> => {
  const { doc } = args || {}

  const ogImage =
    typeof doc?.meta?.image === 'object' &&
    doc.meta.image !== null &&
    'url' in doc.meta.image &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${doc.meta.image.url}`

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | Payload Website Template'
    : 'Payload Website Template'

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}

export const generateSeriesMeta = async (args: { doc: Series }): Promise<Metadata> => {
  const { doc } = args || {}

  const ogImage =
    typeof doc.seriesImage === 'object' &&
    doc.seriesImage.url !== null &&
    doc.seriesImage.url !== undefined &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${doc.seriesImage?.url}`


  const title = doc?.title

  return {
    description: doc.subtitle ?? '',
    openGraph: mergeOpenGraph({
      description: doc.subtitle || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}

export const generateEpisodeMeta = async (args: { doc: Episode }): Promise<Metadata> => {
  const { doc } = args || {}

  const ogImage =
    (typeof doc?.episodeImage === 'object' &&
    doc.episodeImage !== null &&
    doc.episodeImage.url !== null &&
    doc.episodeImage.url !== undefined &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${doc.episodeImage.url}`)
    || (typeof doc?.series === 'object' && typeof doc.series?.seriesImage === 'object' &&
    doc.series.seriesImage.url !== null &&
    doc.series.seriesImage.url !== undefined &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${doc.series?.seriesImage?.url}`)


  const title = doc?.fullTitle

  return {
    description: doc.fullTitle,
    openGraph: mergeOpenGraph({
      description: doc.fullTitle || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
