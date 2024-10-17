import { CATEGORIES } from './categories'
import { LINK_FIELDS } from './link'
import { COVER_IMAGE_FIELDS, MEDIA, MEDIA_FIELDS } from './media'
import { META } from './meta'

export const CALL_TO_ACTION = `
...on Cta {
  blockType
  invertBackground
  richText
  links {
    link ${LINK_FIELDS()}
  }
}
`

export const CONTENT = `
...on Content {
  blockType
  invertBackground
  columns {
    size
    richText
    enableLink
    link ${LINK_FIELDS()}
  }
}
`

export const MEDIA_BLOCK = `
...on MediaBlock {
  blockType
  invertBackground
  position
  ${MEDIA}
}
`

export const ARCHIVE_BLOCK = `
...on Archive {
  blockType
  introContent
  populateBy
  relationTo
  ${CATEGORIES}
  limit
  selectedDocs {
    relationTo
    value {
      ...on Post {
        id
        slug
        title
        ${META}
      }
      ...on Project {
        id
        slug
        title
        ${META}
      }
    }
  }
  populatedDocs {
    relationTo
    value {
      ...on Post {
        id
        slug
        title
        ${CATEGORIES}
        ${META}
      }
      ...on Project {
        id
        slug
        title
        ${CATEGORIES}
        ${META}
      }
    }
  }
  populatedDocsTotal
}
`

export const SERIES_LIST = `
...on SeriesList {
  blockType
}
`

export const LIBRARY_LIST = `
...on LibraryList {
  blockType
  mediaType
}
`

export const LINK_TILE_LIST = `
...on LinkTileList {
  blockType
  title
  description
  linkTiles {
    linkTile {
      title
      subtitle
      backgroundImage {
        ${COVER_IMAGE_FIELDS}
      }
      overlayColour
      type
      newTab
      reference {
        relationTo
        value {
          ...on Page {
            id
            slug
            title
          }
        }
      }
      url
      linkedMedia {
        id
        ${MEDIA_FIELDS}
      }
    }
  }
  paddingBottom
}
`
