import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'
import { getStaticFile } from '@/utilities/getStaticFile'
import { headers } from 'next/headers'

export async function Header({pageType}: {pageType: string}) {
  const header: Header = await getCachedGlobal('header', 1)()

  const logoUrl = getStaticFile('dpc-mini-logo.png')

  const pageHeaders = await headers()
  const erasePath = pageHeaders.get('X-Erase-Path') === '1'

  return <HeaderClient header={header} logoUrl={logoUrl} pageType={pageType} erasePrefix={erasePath} />
}
