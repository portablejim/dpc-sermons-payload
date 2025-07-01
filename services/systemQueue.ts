import { getPayload } from 'payload'
import config from '@payload-config'
import { processEpisodesRaw } from '@/collections/TalkEpisodes/hooks/processEpisodes'

async function processQueue() {
  const payload = await getPayload({ config })
  await processEpisodesRaw(payload)

  setTimeout(processQueue, 30 * 1000);
}

setTimeout(processQueue, 0);
