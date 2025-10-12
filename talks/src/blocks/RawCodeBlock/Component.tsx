import React from 'react'

export type RawCodeBlockProps = {
  bodyCode: string
  cssCode: string
  limitWidth: boolean
  blockType: 'raw-code-block'
}

type Props = RawCodeBlockProps & {
  className?: string
}

export const RawCodeBlock: React.FC<Props> = ({ bodyCode, cssCode, limitWidth = true }) => {
  const bodyCodeSet = bodyCode || ''
  const cssCodeSet = cssCode || ''

  let cssClasses = 'codeBlock '
  if (limitWidth) {
    cssClasses += 'container'
  }

  return (
    <>
      <style type="text/css" dangerouslySetInnerHTML={{ __html: cssCodeSet }} />
      <div className={cssClasses} dangerouslySetInnerHTML={{ __html: bodyCodeSet }}></div>
    </>
  )
}
