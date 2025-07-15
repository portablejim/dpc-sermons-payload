import { CollectionBeforeChangeHook } from 'payload'
import { Episode } from '@/payload-types'

export const updateValidMedia: CollectionBeforeChangeHook = ({ data }) => {
  const dataObject: Partial<Episode> | undefined = data
  dataObject.hasValidMedia = false
  if (
    dataObject?.audioFormat === 'linked' &&
    !!dataObject?.linkedAudioUrl &&
    dataObject?.linkedAudioUrl.length > 0
  ) {
    if (
      dataObject?.linkedAudioFiletype &&
      dataObject?.linkedAudioFiletype.length > 1 &&
      dataObject?.linkedAudioFileSize &&
      dataObject?.linkedAudioFileSize > 0 &&
      dataObject?.linkedAudioLength &&
      dataObject?.linkedAudioLength > 0
    ) {
      dataObject.hasValidMedia = true
    } else {
    }
  }
  return dataObject
}
