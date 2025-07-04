import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'
import { getStaticFile } from '@/utilities/getStaticFile'

export async function Header() {
  const header: Header = await getCachedGlobal('header', 1)()

  const logoUrl = getStaticFile('dpc-mini-logo.png')

  return <HeaderClient header={header} logoUrl={logoUrl} />
}
