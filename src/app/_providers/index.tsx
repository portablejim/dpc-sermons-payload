'use client'

import React from 'react'
import { NextUIProvider } from '@nextui-org/system'

import { AuthProvider } from '../_providers/Auth'
import { ThemeProvider } from './Theme'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <NextUIProvider>
        <AuthProvider>{children}</AuthProvider>
      </NextUIProvider>
    </ThemeProvider>
  )
}
