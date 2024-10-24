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

export const EPISODE_FIELDS_CONTEXT = (seriesFields: String): String => `
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
  linkedAudioUrl
  talkOutline
  series {
    ${seriesFields}
  }
  slug
`

export const EPISODE_FIELDS = EPISODE_FIELDS_CONTEXT('id')
export const EPISODE_FIELDS_WITH_SERIES = EPISODE_FIELDS_CONTEXT(SERIES_FIELDS)

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

export const EPISODE = `
  query Episode($slug: String) {
    Episodes(where: { slug: { equals: $slug }}, limit: 1) {
    docs {
      ${EPISODE_FIELDS_WITH_SERIES}
    }
    }
  }
`
