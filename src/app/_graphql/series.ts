import { COVER_IMAGE_FIELDS } from './media'

export const SERIES_FIELDS = `
  id
  title
  subtitle
  seriesDate
  seriesImage {
    ${COVER_IMAGE_FIELDS}
  }
  slug
`

export const SERIES = `
  query Series($slug: String) {
    allSeries(where: { slug: { equals: $slug }}, limit: 1) {
    docs {
      ${SERIES_FIELDS}
    }
    }
  }
`

export const EPISODE_FIELDS = `
  title
  sermonDate
  biblePassageText
  speaker {
    id
    name
  }
  sermonDateYear
  episodeImage {
    ${COVER_IMAGE_FIELDS}
  }
  videoFormat
  videoUrl
  audioFormat
  audioUrl
  talkOutline
  series {
    id
  }
  slug
`

export const SERIES_EPISODE_LIST = `
  query Episodes($seriesId: JSON) {
    Episodes(draft: false, where: { series: { equals: $seriesId }}) {
      docs {
        ${EPISODE_FIELDS}
      }
      totalDocs
    }
  }
`
