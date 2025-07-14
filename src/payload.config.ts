// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import {
  AlignFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  ItalicFeature,
  LinkFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import sharp from 'sharp' // editor-import
import { UnderlineFeature } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import BibleBooks from './collections/BibleBooks'
import BibleChapters from './collections/BibleChapters'
import TalkSeries from './collections/TalkSeries'
import TalkSpeakers from './collections/TalkSpeakers'
import { CoverImages } from './collections/CoverImages'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { TalkAudio } from './collections/TalkAudio'
import { TalkEpisodes } from './collections/TalkEpisodes'
import Users from './collections/Users'
import { seedHandler } from './endpoints/seedHandler'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { revalidateRedirects } from './hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { Page } from 'src/payload-types'

import { seedHandlerEpisodes } from './endpoints/seedHandlerEpisodes'
import { CoverImageSvgs } from './collections/CoverImageSvgs'
import { Defaults } from '@/Defaults/config'
import { seedHandlerImages } from '@/endpoints/seedHandlerImages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const generateTitle: GenerateTitle<Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | DPC Sermons & Files Hub` : 'DPC Sermons & Files Hub'
}

const generateURL: GenerateURL<Page> = ({ doc }) => {
  if (doc.slug) {
    if (doc.slug.startsWith('talks')) {
      return `${process.env.APP_URL_TALKS!}/${doc.slug}`
    } else {
      return `${process.env.APP_URL_HUB!}/${doc.slug}`
    }
  } else {
    return process.env.NEXT_PUBLIC_SERVER_URL!
  }
}

export default buildConfig({
  admin: {
    components: {},
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        LinkFeature({
          enabledCollections: ['pages'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              return !('name' in field && field.name === 'url')
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
      ]
    },
  }),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: !!process.env.DB_DEVELOPMENT || false,
  }),
  graphQL: {
    disable: !process.env.DB_DEVELOPMENT && true,
  },
  collections: [
    BibleBooks,
    BibleChapters,
    CoverImages,
    CoverImageSvgs,
    Pages,
    Media,
    TalkAudio,
    TalkEpisodes,
    TalkSeries,
    TalkSpeakers,
    Users,
  ],
  cors: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  csrf: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  endpoints: [
    // The seed endpoint is used to populate the database with some example data
    // You should delete this endpoint before deploying your site to production
    {
      handler: seedHandler,
      method: 'get',
      path: '/seed',
    },
    {
      handler: seedHandlerImages,
      method: 'get',
      path: '/seedImages',
    },
    {
      handler: seedHandlerEpisodes,
      method: 'get',
      path: '/seedEpisodes',
    },
  ],
  globals: [Header, Footer, Defaults],
  plugins: [
    redirectsPlugin({
      collections: ['pages'],
      overrides: {
        // @ts-expect-error Unsure why this will error.
        fields: ({ defaultFields }) => {
          return defaultFields.map((field) => {
            if ('name' in field && field.name === 'from') {
              return {
                ...field,
                admin: {
                  description: 'You will need to rebuild the website when changing this field.',
                },
              }
            }
            return field
          })
        },
        hooks: {
          afterChange: [revalidateRedirects],
        },
      },
    }),
    nestedDocsPlugin({
      collections: [],
    }),
    seoPlugin({
      generateTitle,
      generateURL,
    }),
    formBuilderPlugin({
      fields: {
        payment: false,
      },
      formOverrides: {
        fields: ({ defaultFields }) => {
          return defaultFields.map((field) => {
            if ('name' in field && field.name === 'confirmationMessage') {
              return {
                ...field,
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => {
                    return [
                      ...rootFeatures,
                      FixedToolbarFeature(),
                      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    ]
                  },
                }),
              }
            }
            return field
          })
        },
      },
    }),
    /*
    searchPlugin({
      collections: ['posts'],
      beforeSync: beforeSyncWithSearch,
      searchOverrides: {
        fields: ({ defaultFields }) => {
          return [...defaultFields, ...searchFields]
        },
      },
    }),
    */
  ],
  secret: process.env.PAYLOAD_SECRET!,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
