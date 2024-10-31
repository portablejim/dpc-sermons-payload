import { getPayload, PaginatedDocs } from "payload"
import configPromise from '@payload-config'
import config from '@payload-config'
import { Episode } from "@/payload-types"
import { equal } from "assert"
import url from 'url'
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url"
import uuidv5 from 'uuidv5'

const ERROR_RSS = baseUrl => `<?xml version="1.0" encoding="utf-8" ?>
<rss version="2.0">
<channel>
<title>Podcast not Found</title>
<link>${baseUrl}</link>
<description>Podcast not found</description>
</channel>
</rss>
`

const ERROR_ATOM = `<?xml version="1.0" encoding="utf-8">
<feed xmlns="http://www.w3.org/2005/Atom">
<title>Podcast not Found</title>
</feed>
`

// add a leading 0 to a number if it is only one digit
function addLeadingZero(num) {
  num = num.toString();
  while (num.length < 2) num = "0" + num;
  return num;
}

// Source: https://whitep4nth3r.com/blog/how-to-format-dates-for-rss-feeds-rfc-822/
function buildRFC822Date(dateString: string): string {
  const dayStrings = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthStrings = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const timeStamp = Date.parse(dateString);
  const date = new Date(timeStamp);

  const day = dayStrings[date.getUTCDay()];
  const dayNumber = addLeadingZero(date.getUTCDate());
  const month = monthStrings[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const time = `${addLeadingZero(date.getUTCHours())}:${addLeadingZero(date.getUTCMinutes())}:00`;
  const timezone = 'GMT';

  //Wed, 02 Oct 2002 13:00:00 GMT
  return `${day}, ${dayNumber} ${month} ${year} ${time} ${timezone}`;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ selector: string, type: string }> }
  ) {
    const { selector: selectorRaw, type: episodeType } = await params
    const { headers } = request
    const selectorParts = selectorRaw.split('.', 2)

    let baseUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? ''

    let acceptHeaders = headers.get('Accept')?.split(',').map(acc => acc.trim().split(';')[0])
    let disposition = 'inline'
    let parsedUrl = new URL(request.url, baseUrl)
    if(parsedUrl.searchParams.has('download') && parsedUrl.searchParams.get('download') === 'true') {
      disposition = 'attachment'
    }

    let mimeTypeAtom = 'plan/text'
    let mimeTypeRss = 'plan/text'
    if (acceptHeaders?.includes('text/xml')) {
      mimeTypeAtom = 'text/xml'
      mimeTypeRss = 'text/xml'
    }
    if (acceptHeaders?.includes('application/xml')) {
      mimeTypeAtom = 'application/xml'
      mimeTypeRss = 'application/xml'
    }
    if (acceptHeaders?.includes('application/atom+xml')) {
      mimeTypeAtom = 'application/atom+xml'
    }
    if (acceptHeaders?.includes('application/rss+xml')) {
      mimeTypeRss = 'application/rss+xml'
    }

    let urlUUID = uuidv5('url', parsedUrl.toString())

    if (selectorParts.length <= 1) {
      if (selectorRaw != 'latest' && isNaN(parseInt(selectorRaw))) {
      return new Response(ERROR_RSS(baseUrl), {
        status: 404,
            statusText: 'Podcast not found',
            headers: new Headers({
              'Content-Type': mimeTypeRss,
            }),
      })
      } else {
        return Response.redirect(selectorRaw + '.rss')
      }

    } else if (selectorParts.length == 2) {
      if (selectorParts[0] != 'latest' && isNaN(parseInt(selectorParts[0]))) {
        if(selectorParts[1] === 'atom')
        {
          return new Response(ERROR_ATOM, {
            status: 404,
            statusText: 'Podcast not found',
            headers: new Headers({
              'Content-Type': mimeTypeAtom,
            }),
          })
        } else {
          return new Response(ERROR_RSS(baseUrl), {
            status: 404,
            statusText: 'Podcast not found',
            headers: new Headers({
              'Content-Type': mimeTypeRss,
            }),
          })
        }
      } else if(['atom', 'rss', 'xml'].includes(selectorParts[1]) === false) {
        return Response.redirect(selectorParts[0] + '.rss')
      }
    } else {
        return Response.redirect(selectorParts[0] + '.rss')
    }

    if(!['regular', 'special'].includes(episodeType)){
        if(selectorParts[2] === 'atom')
        {
          return new Response(ERROR_ATOM, {
            status: 404,
            statusText: 'Podcast not found',
            headers: new Headers({
              'Content-Type': mimeTypeAtom,
            }),
          })
        } else {
          return new Response(ERROR_RSS(baseUrl), {
            status: 404,
            statusText: 'Podcast not found',
            headers: new Headers({
              'Content-Type': mimeTypeRss,
            }),
          })
        }
    }

    let filter: 'latest' | number = 'latest'
    if(selectorParts[0] !== 'latest') {
      filter = parseInt(selectorParts[0])
    }

    // The format should now be set up.
    // Either: latest.xml / latest.rss / latest.atom
    // Or: <year>.xml / <year>.rss / <year>.atom

    let payload = getPayload({ config })

    let titleTalkType = 'Bible'
    let titleTalkTypeSuffix = ''
    let filenameTalkType = 'bible'
    let filenameTalkTypeSuffix = ''
    if(episodeType === 'special') {
      titleTalkType = 'Special Event'
      titleTalkTypeSuffix = ''
      filenameTalkType = 'special'
      filenameTalkTypeSuffix = ''
    } else {
      titleTalkType = 'Other'
      titleTalkTypeSuffix = ', ' + episodeType
      filenameTalkType = 'special'
      filenameTalkTypeSuffix = '-' + episodeType
    }

    let episodes: PaginatedDocs<Episode> | null = null
    let podcastTitle = `DPC ${titleTalkType} Talks`
    let podcastFilename = `dpc-${filenameTalkType}-talks`
    if(filter === 'latest')
    {
      let timestamp = new Date()
      let thisYear = timestamp.getFullYear()
      let lastYear = thisYear - 1
      let targetYears = [thisYear]
      if (timestamp.getMonth() < 7) {
        targetYears.push(lastYear)
      }

      podcastTitle = `DPC ${titleTalkType} Talks (Latest${titleTalkTypeSuffix})`
      podcastFilename = `dpc-${filenameTalkType}-talks-latest${filenameTalkTypeSuffix}`

      episodes = await (await payload).find({
        collection: 'episodes',
        where: {
          and: [
            {
              episodeType: {
                equals: episodeType
              },
            },
            {
              sermonDateYear: {
                in: targetYears
              },
            },
          ]
        },
        sort: '-sermonDate',
        limit: 99,
      })
    } else if(typeof filter === 'number') {
      let startDate = filter.toFixed(0).padStart(4, '0') + '-01-01';
      let endDate = filter.toFixed(0).padStart(4, '0') + '-12-31';

      podcastTitle = `DPC ${titleTalkType} Talks (${filter}${titleTalkTypeSuffix})`
      podcastFilename = `dpc-${filenameTalkType}-talks-${filter}${filenameTalkTypeSuffix}`

      episodes = await (await payload).find({
        collection: 'episodes',
        where: {
          sermonDateYear: {
            equals: filter
          }
        },
        sort: '-sermonDate',
      })
    } else {
        if(selectorParts[1] === 'atom')
        {
          return new Response(ERROR_ATOM, {
            status: 404,
            statusText: 'Podcast not found',
            headers: new Headers({
              'Content-Type': mimeTypeAtom,
            }),
          })
        } else {
          return new Response(ERROR_RSS(baseUrl), {
            status: 404,
            statusText: 'Podcast not found',
            headers: new Headers({
              'Content-Type': mimeTypeRss,
            }),
          })
        }
    }

    let podcastImage = baseUrl + '/dpcPodcast.png'

    if (selectorParts[1] !== 'atom') {
      let episodeRssList = episodes?.docs.map(e => {
        let audioMimetype = ''
        let audioUrl = ''
        let audioLength = ''
        let audioDuration = ''

        if (e.audioFormat === 'linked') {
          audioMimetype = e.linkedAudioFiletype ?? ''
          audioUrl = e.linkedAudioUrl ?? ''
          audioLength = Math.round(e.linkedAudioFileSize ?? 0).toFixed(0)
          audioDuration = new Date(e.linkedAudioLength ?? 0 * 1000).toISOString().slice(11, 19);
        }

        let isPermaLink = 'false'
        let itemUuid = uuidv5(urlUUID, `${e.id}`)
        let itemGuid = baseUrl + '/' + e.id.toFixed()
        if(e.guid) {
          itemGuid = `${baseUrl}/sermon/guid/${e.guid}`
          isPermaLink = 'true'
          itemUuid = uuidv5(urlUUID, e.guid)
        }

        let itemImage = ''
        if (typeof e.series !== 'number') {
          if(typeof e.series?.seriesImage != 'number' && e.series?.seriesImage?.sizes?.largeSquare?.url) {
            itemImage = baseUrl + e.series?.seriesImage?.sizes?.largeSquare?.url;
          }
        }
        if(typeof e.episodeImage != 'number' && e.episodeImage?.sizes?.largeSquare?.url) {
          itemImage = baseUrl + e.episodeImage?.sizes?.largeSquare?.url;
        }

        let seriesMarkup = ''
        let itemPubDate = buildRFC822Date(e.sermonDate)
        let speakerName= ''
        if (typeof e.speaker !== 'number' && e.speaker?.name) {
          speakerName = e.speaker?.name
        }
        let seriesName = ''
        if (typeof e.series !== 'number') {
          seriesName = encodeURIComponent(e.series?.title ?? '')
          let seriesDate = e.series?.seriesDate.substring(0, 10) ?? ''
          let seriesNum = parseInt(seriesDate.replaceAll('-', ''))
          seriesMarkup = `<podcast:season name="${seriesDate}">${seriesNum}</podcast:season>`
        }

        let videoMarkup = ''
        if ((e.videoFormat == 'vimeo' || e.videoFormat === 'youtube') && e.videoUrl !== undefined && e.videoUrl !== null && e.videoUrl.length > 0)
        {
          videoMarkup = `<podcast:contentLink>${e.videoUrl}</podcast:contentLink>`
        }

        let subtitle = e.subtitle ?? ''

        let itunesImageStr = ''
        if(itemImage.trim().length > 0)
        {
          itunesImageStr = `<itunes:image href="${itemImage}" />`
        }

        return `
    <item>
      <title>${e.fullTitle}</title>
      <itunes:author>${speakerName}</itunes:author>
      <itunes:summary></itunes:summary>
      <description></description>
      <enclosure type="${audioMimetype}" length="${audioLength}" url="${audioUrl}" />
      <itunes:duration>${audioDuration}</itunes:duration>
      <guid isPermaLink="${true}">${itemGuid}</guid>
      ${itunesImageStr}
      <pubDate>${itemPubDate}</pubDate>
      ${seriesMarkup}
      ${videoMarkup}
    </item>`
      })

      let episodesBody = episodeRssList.join('')

      let rssBody = `<?xml version="1.0" encoding="utf-8" ?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
xmlns:content="http://purl.org/rss/1.0/modules/content/"
xmlns:podcast="https://podcastindex.org/namespace/1.0"
xmlns:atom="http://www.w3.org/2005/Atom" >
  <channel>
    <title>DPC Bible Talks</title>
    <link>http://www.dubbo.church</link>
    <language>en-au</language>
    <copyright>℗ &amp; © Dubbo Presbyterian Church</copyright>
    <itunes:subtitle>Dubbo Presbyterian Church Bible Talks</itunes:subtitle>
    <category>Christianity</category>
    <itunes:category text="Religion &amp; Spirituality"><itunes:category text="Christianity"/></itunes:category>
    <itunes:author>Dubbo Presbyterian Church</itunes:author>
    <itunes:summary>Dubbo Presbyterian Church Bible Talks</itunes:summary>
    <description>Dubbo Presbyterian Church Bible Talks</description>
    <itunes:owner>
      <itunes:name>Dubbo Presbyterian Church</itunes:name>
      <itunes:email>wayne@dpc.org.au</itunes:email>
    </itunes:owner>
    <itunes:image href="${podcastImage}"/>
    <itunes:explicit>false</itunes:explicit>
    <atom:link href="${parsedUrl}" rel="self" type="application/rss+xml" />
    ${episodesBody}
  </channel>
</rss>
`
        return new Response(rssBody, {
          status: 200,
          statusText: 'Ok',
          headers: new Headers({
            'Content-Type': mimeTypeRss,
            'Content-Disposition': `${disposition}; filename="${podcastFilename}.${selectorParts[1]}"`,
          }),
        })
      }

      return Response.json({
        selectorParts,
        episodes,
      })
  }