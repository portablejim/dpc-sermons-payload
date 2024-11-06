import React, { createElement } from 'react'

export type CodeBlockProps = {
  bodyCode: string
  cssCode: string
  limitWidth: boolean
  blockType: 'codeblock'
}

type Props = CodeBlockProps & {
  className?: string
}

export const CodeBlock: React.FC<Props> = ({ className, bodyCode, cssCode, limitWidth = true }) => {

  function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  let bodyCodeSet = bodyCode || ''
  let cssCodeSet =  cssCode || ''

  let cssClasses = 'codeBlock '
  if(limitWidth) {
    cssClasses += 'container'
  }

  return (
    <>
    <style type="text/css" dangerouslySetInnerHTML={{ __html: cssCodeSet }} />
    <div className={cssClasses} dangerouslySetInnerHTML={{ __html: bodyCodeSet}}>
    </div>
    </>
  )
}
