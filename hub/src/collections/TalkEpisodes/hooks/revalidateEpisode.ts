import { AfterChangeHook } from 'node_modules/payload/dist/collections/config/types'

import { revalidatePath } from 'next/cache'
import { Episode } from '@/payload-types'
import { BasePayload } from 'payload'

// Revalidate the post in the background, so the user doesn't have to wait
// Notice that the hook itself is not async and we are not awaiting `revalidate`
// Only revalidate existing docs that are published
// Don't scope to `operation` in order to purge static demo posts
export const revalidateEpisode: AfterChangeHook = ({ doc, req: { payload } }) => {
  return revalidateEpisodeRaw(doc, payload)
}

export const revalidateEpisodeRaw = (doc: Episode, payload: BasePayload) => {
  if (doc._status === 'published') {
    revalidatePath(`/sermon/${doc.slug}`)
    revalidatePath(`/podcast/${doc.episodeType}/${doc.sermonDateYear}.xml`)
    revalidatePath(`/podcast/${doc.episodeType}/${doc.sermonDateYear}.rss`)
    revalidatePath(`/podcast/${doc.episodeType}/latest.xml`)
    revalidatePath(`/podcast/${doc.episodeType}/latest.rss`)
    revalidatePath(`/api/episodes/yearList/regular`)
    revalidatePath(`/api/episodes/byYear/regular/${doc.sermonDateYear}`)
    revalidatePath(`/api/episodes/bookList/regular`)
    revalidatePath(`/api/episodes/byBook/regular`)
    if (typeof doc.series == 'number') {
      payload
        .findByID({
          collection: 'series',
          id: doc.series,
        })
        .then((docSeries) => {
          const fullSermonPath = `/series/${docSeries.slug}/sermon/${doc.slug}`
          revalidatePath(fullSermonPath)
          payload.logger.info(`Revalidated ${fullSermonPath}.`)
        })
    }
  }

  return doc
}
