import { cn } from 'src/utilities/cn'
import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { SeriesList } from '@/blocks/SeriesList/Component'
import { LibraryList } from '@/blocks/LibraryList/Component'
import { LinkTileList } from '@/blocks/LinkTileList/Component'
import { CodeBlock } from '@/blocks/Code/Component'
import { RawCodeBlock } from '@/blocks/RawCodeBlock/Component'

const blockComponents = {
  //code: CodeBlock,
  'raw-code-block': RawCodeBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  seriesList: SeriesList,
  libraryList: LibraryList,
  linkTileList: LinkTileList,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-8" key={index}>
                  <Block {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
