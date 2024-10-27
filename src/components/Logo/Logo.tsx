import React from 'react'

export const Logo = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL!
  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Payload Logo"
      className="max-w-[3rem] invert dark:invert-0"
      src={baseUrl + '/dpc-mini-logo.png'}
    />
  )
}
