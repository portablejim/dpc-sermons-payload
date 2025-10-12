import { AfterChangeHook } from 'node_modules/payload/dist/collections/config/types'

import { revalidatePath } from 'next/cache'

// Revalidate the post in the background, so the user doesn't have to wait
// Notice that the hook itself is not async and we are not awaiting `revalidate`
// Only revalidate existing docs that are published
// Don't scope to `operation` in order to purge static demo posts
export const revalidateSeries: AfterChangeHook = ({ doc }) => {
  if (doc._status === 'published') {
    revalidatePath(`/series/${doc.slug}`)
  }

  return doc
}
