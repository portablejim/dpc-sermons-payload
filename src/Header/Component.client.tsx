'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

import './module.css'

interface HeaderClientProps {
  header: Header
  logoUrl: string
  pageType: string
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header, logoUrl, pageType }) => {
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

  let secondaryLinksOuter = <></>
  if (pageType === 'talks') {
    let talksPrefix = ''
    if(pathname.startsWith('/talks')) {
      talksPrefix = 'talks'
    }
    const commonSecondaryClasses = 'inline-block hover:text-gray-300 flex-grow w-1/2'
    const currentSecondaryClasses =
      'p-2 mx-2 current border-b-white dark:border-b-gray-400 border-t-black font-bold border-y-4 hover:border-b-gray-300'
    const nonCurrentSecondaryClasses = 'px-2 py-3 mx-2 m-b-3 font-thin'
    let secondaryLinks = <></>
    if (secondaryNavigation === 'regular') {
      secondaryLinks = (
        <>
          <Link
            href={talksPrefix + '/main'}
            aria-current={'page'}
            className={`${commonSecondaryClasses} ${currentSecondaryClasses}`}
          >
            Main Talk Library
          </Link>
          <Link
            href={talksPrefix + '/other'}
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
            href={talksPrefix + '/main'}
            className={`${commonSecondaryClasses} ${nonCurrentSecondaryClasses}`}
          >
            Main Talk Library
          </Link>
          <Link
            href={talksPrefix + '/other'}
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
          className={'container flex flex-col justify-between'}
        >
          <p className={'mainBackButton'}><a href="https://dubbo.church">&lt; Main <span className={"shortName"}>DPC</span><span className={"longName"}>Dubbo Presbtyerian Church</span> Website </a> </p>
          <p
            className={'flex-grow flex items-center text-center m-auto pb-4 md:text-left text-2xl'}
          >
            <a href="https://dubbo.church">Dubbo Presbtyerian Church</a>
          </p>
        </nav>
      </div>
      {secondaryLinksOuter}
    </header>
  )
}
