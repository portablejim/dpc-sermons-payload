import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'

export async function Footer() {
  const footer: Footer = await getCachedGlobal('footer')()

  const navItems = footer?.navItems || []
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL!

  return (
    <footer className="border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <picture>
            <img
              alt="DPC Logo"
              className="max-w-[3rem] invert-0"
              src={baseUrl + '/dpc-mini-logo.png'}
            />
          </picture>
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center pb-4 md:pb-0">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
