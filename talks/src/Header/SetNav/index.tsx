'use client'

import React, { useEffect } from 'react'
import { useHeaderTheme } from '@/providers/HeaderTheme'

export const SetNav: React.FC<{ primaryNav: string | null; secondaryNav: string | null }> = ({
  primaryNav,
  secondaryNav,
}) => {
  const { setPrimaryNavigation, setSecondaryNavigation } = useHeaderTheme()

  useEffect(() => {
    setPrimaryNavigation(primaryNav)
  }, [primaryNav, setPrimaryNavigation])

  useEffect(() => {
    setSecondaryNavigation(secondaryNav)
  }, [secondaryNav, setSecondaryNavigation])

  return <React.Fragment />
}
