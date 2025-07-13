import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['localhost', 'l.pjim.au', '*.pjim.au'],
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
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
