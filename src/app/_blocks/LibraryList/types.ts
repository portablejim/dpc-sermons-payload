import type { Page } from '../../../payload/payload-types'

export type SeriesListProps = Extract<Page['layout'][0], { blockType: 'seriesList' }>
