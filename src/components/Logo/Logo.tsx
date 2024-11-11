import React from 'react'

interface LogoProps {
  logoUrl: string
}

export const Logo: React.FC<LogoProps> = ({ logoUrl }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL!
  return (
    /* eslint-disable @next/next/no-img-element */
    <img alt="Payload Logo" className="max-w-[3rem] invert dark:invert-0" src={logoUrl} />
  )
}
