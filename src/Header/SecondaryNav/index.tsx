'use client'

import React from 'react'
import { useHeaderTheme } from '@/providers/HeaderTheme'

export const HeaderNav: React.FC<{ primaryNav: string | null; secondaryNav: string | null }> = ({
  primaryNav,
  secondaryNav,
}) => {
  const { setPrimaryNavigation, setSecondaryNavigation } = useHeaderTheme()

  setPrimaryNavigation(primaryNav)
  setSecondaryNavigation(secondaryNav)

  return <React.Fragment />
}
