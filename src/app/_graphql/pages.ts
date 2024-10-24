import {
  CALL_TO_ACTION,
  CONTENT,
  LIBRARY_LIST,
  LINK_TILE_LIST,
  MEDIA_BLOCK,
  SERIES_LIST,
} from './blocks'
import { META } from './meta'

export const PAGES = `
  query Pages {
    Pages(limit: 300)  {
      docs {
        slug
      }
    }
  }
`

export const PAGE = `
  query Page($slug: String, $draft: Boolean) {
    Pages(where: { slug: { equals: $slug }}, limit: 1, draft: $draft) {
      docs {
        id
        title
        layout {
          ${CONTENT}
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${LIBRARY_LIST}
          ${SERIES_LIST}
          ${LINK_TILE_LIST}
        }
        ${META}
      }
    }
  }
`
