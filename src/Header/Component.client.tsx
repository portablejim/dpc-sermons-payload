'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  header: Header
  logoUrl: string
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header, logoUrl }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme, primaryNavigation, secondaryNavigation } = useHeaderTheme()
  const pathname = usePathname()

  let isTalks = false
  if (
    pathname === '' ||
    pathname === '/home' ||
    pathname === '/talks-main' ||
    pathname === '/talks-other' ||
    pathname.startsWith('/series')
  ) {
    isTalks = true
  }

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    setHeaderTheme(theme === 'dark' ? 'dark' : 'light')
  }, [setHeaderTheme, theme])

  let navLinks = <></>
  const commonClasses =
    'inline-block p-2 mx-2 hover:text-gray-300 grow md:grow-0 w-1/2 md:whitespace-nowrap'
  const currentClasses = 'current border-b-white border-b-3 hover:border-b-gray-300'
  const nonCurrentClasses = 'm-b-3'
  if (isTalks) {
    navLinks = (
      <>
        <Link
          href="/talks-main"
          aria-current={'page'}
          className={`${commonClasses} ${currentClasses}`}
        >
          Talks
        </Link>
        <Link href="/members-hub" className={`${commonClasses} ${nonCurrentClasses}`}>
          Members Hub
        </Link>
      </>
    )
  } else {
    navLinks = (
      <>
        <Link href="/talks-main" className={`${commonClasses} ${nonCurrentClasses}`}>
          Talks
        </Link>
        <Link
          href="/members-hub"
          aria-current={'page'}
          className={`${commonClasses} ${currentClasses}`}
        >
          Members Hub
        </Link>
      </>
    )
  }

  let secondaryLinksOuter = <></>
  if (primaryNavigation === 'talks') {
    const commonSecondaryClasses = 'inline-block hover:text-gray-300 flex-grow w-1/2'
    const currentSecondaryClasses =
      'p-2 mx-2 current border-b-white dark:border-b-gray-400 border-t-black font-bold border-y-4 hover:border-b-gray-300'
    const nonCurrentSecondaryClasses = 'px-2 py-3 mx-2 m-b-3 font-thin'
    let secondaryLinks = <></>
    if (secondaryNavigation === 'regular') {
      secondaryLinks = (
        <>
          <Link
            href="/talks-main"
            aria-current={'page'}
            className={`${commonSecondaryClasses} ${currentSecondaryClasses}`}
          >
            Main Talk Library
          </Link>
          <Link
            href="/talks-other"
            className={`${commonSecondaryClasses} ${nonCurrentSecondaryClasses}`}
          >
            Other Talks
          </Link>
        </>
      )
    } else if (secondaryNavigation === 'special') {
      secondaryLinks = (
        <>
          <Link
            href="/talks-main"
            className={`${commonSecondaryClasses} ${nonCurrentSecondaryClasses}`}
          >
            Main Talk Library
          </Link>
          <Link
            href="/talks-other"
            aria-current={'page'}
            className={`${commonSecondaryClasses} ${currentSecondaryClasses}`}
          >
            Other Talks
          </Link>
        </>
      )
    } else {
      secondaryLinks = (
        <>
          <Link
            href="/talks-main"
            className={`${commonSecondaryClasses} ${nonCurrentSecondaryClasses}`}
          >
            Main Talk Library
          </Link>
          <Link
            href="/talks-other"
            className={`${commonSecondaryClasses} ${nonCurrentSecondaryClasses}`}
          >
            Other Talks
          </Link>
        </>
      )
    }
    secondaryLinksOuter = (
      <>
        <div className="bg-[#27272a] text-white text-large montserrat-regular mb-4">
          <nav aria-label="Talk Libary options" className="container flex flex-row text-center items-center">
            {secondaryLinks}
          </nav>
        </div>
      </>
    )
  }

  return (
    <header className="" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="bg-black text-white text-large montserrat-regular py-4">
        <nav
          aria-label={'Primary Navigation'}
          className={'container flex flex-col md:flex-row justify-between'}
        >
          <p
            className={'flex-grow flex items-center text-center m-auto pb-4 md:text-left text-2xl'}
          >
            <a href="https://dubbo.church">Dubbo Presbtyerian Church</a>
          </p>
          <div className={'navLinks align-middle justify-center flex flex-row text-center'}>
            {navLinks}
          </div>
        </nav>
      </div>
      {secondaryLinksOuter}
    </header>
  )
}
