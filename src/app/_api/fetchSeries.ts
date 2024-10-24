import payload from 'payload'

import type { Episode } from '../../payload/payload-types'
import { SERIES, SERIES_EPISODE_LIST } from '../_graphql/series'
import { GRAPHQL_API_URL } from './shared'

const queryMap = {
  series: {
    query: SERIES,
    key: 'allSeries',
  },
}

export const fetchSeries = async <T>(args: {
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
      return res?.data?.allSeries.docs[0]
    })
    ?.then(async res => {
      const episodeList: any = await fetch(`${GRAPHQL_API_URL}/api/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        next: { tags: [`series_episodes_${res.id}`] },
        body: JSON.stringify({
          query: SERIES_EPISODE_LIST,
          variables: {
            seriesId: res.id,
          },
        }),
      })
        ?.then(r => r.json())
        ?.then(r => {
          if (r.errors) {
            payload.logger.info(r.errors)
            throw new Error(r?.errors?.[0]?.message ?? 'Error fetching episodes')
          }
          return r?.data.Episodes.docs
        })
      res.episodes = episodeList
      return res
    })

  return doc
}
