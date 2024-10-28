import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { NextUIProvider } from '@nextui-org/react'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <NextUIProvider>
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
      </NextUIProvider>
    </ThemeProvider>
  )
}
