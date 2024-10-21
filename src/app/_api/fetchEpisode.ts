import type { Episode } from '../../payload/payload-types'
import { EPISODE } from '../_graphql/episode'
import { GRAPHQL_API_URL } from './shared'

const queryMap = {
  series: {
    query: EPISODE,
    key: 'allSeries',
  },
}

export const fetchEpisode = async <T>(args: {
  slug?: string
  id?: string
}): Promise<T & { episodes: Episode[] }> => {
  const { slug } = args || {}

  const doc: T & { episodes: Episode[] } = await fetch(`${GRAPHQL_API_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    next: { tags: [`series_${slug}`] },
    body: JSON.stringify({
      query: queryMap.series.query,
      variables: {
        slug,
      },
    }),
  })
    ?.then(res => res.json())
    ?.then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      return res?.data?.Episodes.docs[0]
    })

  return doc
}
