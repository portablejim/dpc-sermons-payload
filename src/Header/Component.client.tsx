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
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    setHeaderTheme(theme === 'dark' ? 'dark' : 'light')
  }, [setHeaderTheme, theme])

  return (
    <header
      className="container relative z-20 py-8 flex justify-between flex-wrap"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <Link href="/">
        <Logo />
      </Link>
      <p className='grow pl-4 self-center sm:text-lg'><em className='not-italic font-bold'>DPC Hub</em><span className='sm:inline'>: </span><span className='subtitle block md:inline'> For Sermons and Files</span></p>
      <HeaderNav header={header} />
    </header>
  )
}
