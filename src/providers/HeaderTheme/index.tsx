'use client'

import type { Theme } from '@/providers/Theme/types'

import React, { createContext, useCallback, useContext, useState } from 'react'

import canUseDOM from '@/utilities/canUseDOM'

export interface ContextType {
  headerTheme?: Theme | null
  setHeaderTheme: (theme: Theme | null) => void
  primaryNavigation?: string | null
  setPrimaryNavigation: (primaryNavigation?: string | null) => void
  secondaryNavigation?: string | null
  setSecondaryNavigation: (secondaryNavigation?: string | null) => void
}

const initialContext: ContextType = {
  headerTheme: undefined,
  setHeaderTheme: () => null,
  primaryNavigation: null,
  setPrimaryNavigation: () => null,
  secondaryNavigation: null,
  setSecondaryNavigation: () => null,
}

const HeaderThemeContext = createContext(initialContext)

export const HeaderThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [headerTheme, setThemeState] = useState<Theme | undefined | null>(
    canUseDOM ? (document.documentElement.getAttribute('data-theme') as Theme) : undefined,
  )

  const [primaryNavigation, setPrimaryNavigation] = useState<string | undefined | null>(
    null,
  )

  const [secondaryNavigation, setSecondaryNavigation] = useState<string | undefined | null>(
    null,
  )

  const setHeaderTheme = useCallback((themeToSet: Theme | null) => {
    setThemeState(themeToSet)
  }, [])

  return (
    <HeaderThemeContext.Provider value={{ headerTheme, setHeaderTheme, primaryNavigation, setPrimaryNavigation, secondaryNavigation, setSecondaryNavigation }}>
      {children}
    </HeaderThemeContext.Provider>
  )
}

export const useHeaderTheme = (): ContextType => useContext(HeaderThemeContext)
