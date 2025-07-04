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
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  let isTalks = false
  if(pathname === '' || pathname === '/home' || pathname === '/talks-main' || pathname === '/talks-other' || pathname.startsWith("/series")) {
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
  const commonClasses = "inline-block p-2 mx-2"
  const currentClasses = "current border-b-white border-b-3"
  const nonCurrentClasses = "m-b-3"
  if(isTalks) {
    navLinks = <>
      <Link href="/talks-main" aria-current={'page'} className={`${commonClasses} ${currentClasses}`}>Talks</Link>
      <Link href="/members-hub" className={`${commonClasses} ${nonCurrentClasses}`}>Members Hub</Link>
    </>
  } else {
    navLinks = <>
      <Link href="/" className={`${commonClasses} ${nonCurrentClasses}`}>Talks</Link>
      <Link href="/members-hub" aria-current={'page'} className={`${commonClasses} ${currentClasses}`}>Members Hub</Link>
    </>
  }


  return (
    <header
      className=""
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div
        className="bg-black text-white text-large montserrat-regular py-4"
      >
        <nav aria-label={"Primary Navigation"} className={"container flex flex-row justify-between"}>
          <p className={"flex-grow flex items-center text-2xl"}><a href="https://dubbo.church">
            Dubbo Presbtyerian Church
          </a></p>
          <div className={"navLinks align-middle justify-center"}>
            {navLinks}
          </div>
        </nav>
      </div>
      <div
        className="container relative z-20 py-8 flex justify-between flex-wrap"
      >
        <Link href="/">
          <Logo logoUrl={logoUrl} />
        </Link>
        <p className="grow pl-4 self-center sm:text-lg">
          <em className="not-italic font-bold">DPC Hub</em>
          <span className="sm:inline">: </span>
          <span className="subtitle block md:inline"> For Sermons and Files</span>
        </p>
        <HeaderNav header={header} />
      </div>
    </header>
  )
}
