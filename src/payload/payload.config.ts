import { webpackBundler } from '@payloadcms/bundler-webpack'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloud } from '@payloadcms/plugin-cloud'
import nestedDocs from '@payloadcms/plugin-nested-docs'
import redirects from '@payloadcms/plugin-redirects'
import seo from '@payloadcms/plugin-seo'
import type { GenerateTitle } from '@payloadcms/plugin-seo/types'
import { slateEditor } from '@payloadcms/richtext-slate'
import dotenv from 'dotenv'
import path from 'path'
import { buildConfig } from 'payload/config'

import BibleBooks from './collections/BibleBooks'
import BibleChapters from './collections/BibleChapters'
import { CoverImages } from './collections/CoverImages'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { TalkAudio } from './collections/TalkAudio'
import { TalkEpisodes } from './collections/TalkEpisodes'
import TalkSeries from './collections/TalkSeries'
import TalkSpeakers from './collections/TalkSpeakers'
import Users from './collections/Users'
import { seed } from './endpoints/seed'
import { Footer } from './globals/Footer'
import { Header } from './globals/Header'
import { Settings } from './globals/Settings'

const generateTitle: GenerateTitle = () => {
  return 'My Website'
}

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
})

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    components: {},
    webpack: config => ({
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          dotenv: path.resolve(__dirname, './dotenv.js'),
          [path.resolve(__dirname, './endpoints/seed')]: path.resolve(
            __dirname,
            './emptyModuleMock.js',
          ),
        },
      },
    }),
  },
  editor: slateEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  collections: [
    BibleBooks,
    BibleChapters,
    CoverImages,
    Pages,
    Media,
    Users,
    TalkAudio,
    TalkEpisodes,
    TalkSeries,
    TalkSpeakers,
  ],
  globals: [Settings, Header, Footer],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  cors: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  csrf: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  endpoints:
    process.env.PAYLOAD_ALLOW_SEED !== 'allow'
      ? []
      : [
          {
            path: '/seed',
            method: 'get',
            handler: seed,
          },
        ],
  plugins: [
    redirects({
      collections: ['pages', 'bible-books', 'bible-chapters', 'series', 'episodes'],
    }),
    nestedDocs({
      collections: ['categories'],
    }),
    seo({
      collections: ['pages'],
      generateTitle,
      uploadsCollection: 'media',
    }),
    payloadCloud(),
  ],
})
