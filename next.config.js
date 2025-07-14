import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const APP_URL_HUB = process.env.APP_URL_HUB || ''
const APP_URL_TALKS = process.env.APP_URL_TALKS || ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['localhost', 'l.pjim.au', '*.pjim.au'],
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL, APP_URL_HUB, APP_URL_TALKS]
        .filter((v) => v && v.length > 0)
        .map((item) => {
          const url = new URL(item)

          return {
            hostname: url.hostname,
            protocol: url.protocol.replace(':', ''),
          }
        }),
    ],
  },
  reactStrictMode: true,
  redirects,
  headers() {
    return [
      {
        source: '/static/:filename*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-if-error=302400',
          },
        ],
      },
    ]
  },
  output: 'standalone',
}

export default withPayload(nextConfig)
