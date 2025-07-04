import { getPayload, PaginatedDocs } from "payload"
import config from '@payload-config'
import { Episode } from "@/payload-types"
import { notFound } from "next/navigation"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ guid: string }> }
  ) {
    const { guid } = await params

    const payload = getPayload({ config })
    const episodesFind = await (await payload).find({
      collection: 'episodes',
      where: {
        guid: {
          equals: guid
        }
      },
    })

    if (episodesFind.totalDocs <= 0) {
      return notFound()
    }

    const currentEpisode = episodesFind.docs[0]
    const currentSeries = currentEpisode.series ?? -1
    if(typeof currentSeries === 'number') {
      return Response.redirect('../' + currentEpisode.slug)
    }

    return Response.redirect(`../${currentSeries.slug}/${currentEpisode.slug}`)
  }