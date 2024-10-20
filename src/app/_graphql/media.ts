export const MEDIA_FIELDS = `
mimeType
filename
width
height
alt
caption
`

export const MEDIA = `media {
  ${MEDIA_FIELDS}
}`

export const COVER_IMAGE_FIELDS = `
mimeType
filename
width
height
alt
caption
sizes {
  thumbnail {
    url
  }
  thumbnail {
    url
  }
}
`
