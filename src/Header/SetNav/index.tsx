'use client'

import React, { useEffect } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import { useHeaderTheme } from '@/providers/HeaderTheme'

export const SetNav: React.FC<{ primaryNav: string | null, secondaryNav: string | null }> = ({ primaryNav, secondaryNav }) => {

  const { setPrimaryNavigation, setSecondaryNavigation } = useHeaderTheme()

  useEffect(() => {
    setPrimaryNavigation(primaryNav)
  }, [setPrimaryNavigation])

  useEffect(() => {
    setSecondaryNavigation(secondaryNav)
  }, [setSecondaryNavigation])

  return <React.Fragment />
}
