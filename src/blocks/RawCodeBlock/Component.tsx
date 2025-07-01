import React, { createElement } from 'react'

export type RawCodeBlockProps = {
  bodyCode: string
  cssCode: string
  limitWidth: boolean
  blockType: 'raw-code-block'
}

type Props = RawCodeBlockProps & {
  className?: string
}

export const RawCodeBlock: React.FC<Props> = ({
  className,
  bodyCode,
  cssCode,
  limitWidth = true,
}) => {
  function htmlDecode(input) {
    const e = document.createElement('div')
    e.innerHTML = input
    return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue
  }

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
