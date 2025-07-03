import fs, { readFileSync } from 'fs'
import path from 'path'
import { type Payload, type PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { CoverImageSvg } from '@/payload-types'

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding bible books database...')

  const numBooks = await payload.count({ collection: 'bible-books' })
  if (numBooks?.totalDocs !== 0) {
    payload.logger.info('Database already seeded. Exiting.')
    return
  }

  const filename = fileURLToPath(import.meta.url)
  const dirname = path.dirname(filename)

  const booksInfos: Array<{ name: string; order: number; shortName: string; slug: string }> = [
    { name: 'Genesis', order: 1, shortName: 'Gen', slug: '' },
    { name: 'Exodus', order: 2, shortName: 'Exod', slug: '' },
    { name: 'Leviticus', order: 3, shortName: 'Lev', slug: '' },
    { name: 'Numbers', order: 4, shortName: 'Num', slug: '' },
    { name: 'Deuteronomy', order: 5, shortName: 'Deut', slug: '' },
    { name: 'Joshua', order: 6, shortName: 'Josh', slug: '' },
    { name: 'Judges', order: 7, shortName: 'Judg', slug: '' },
    { name: 'Ruth', order: 8, shortName: 'Ruth', slug: '' },
    { name: '1 Samuel', order: 9, shortName: '1 Sam', slug: '' },
    { name: '2 Samuel', order: 10, shortName: '2 Sam', slug: '' },
    { name: '1 Kings', order: 11, shortName: '1 Kings', slug: '' },
    { name: '2 Kings', order: 12, shortName: '2 Kings', slug: '' },
    { name: '1 Chronicles', order: 13, shortName: '1 Chron', slug: '' },
    { name: '2 Chronicles', order: 14, shortName: '2 Chron', slug: '' },
    { name: 'Ezra', order: 15, shortName: 'Ezra', slug: '' },
    { name: 'Nehemiah', order: 16, shortName: 'Neh', slug: '' },
    { name: 'Esther', order: 17, shortName: 'Esther', slug: '' },
    { name: 'Job', order: 18, shortName: 'Job', slug: '' },
    { name: 'Psalms', order: 19, shortName: 'Ps', slug: '' },
    { name: 'Proverbs', order: 20, shortName: 'Prov', slug: '' },
    { name: 'Ecclesiastes', order: 21, shortName: 'Eccles', slug: '' },
    { name: 'Song of Solomon', order: 22, shortName: 'Song', slug: '' },
    { name: 'Isaiah', order: 23, shortName: 'Isa', slug: '' },
    { name: 'Jeremiah', order: 24, shortName: 'Jer', slug: '' },
    { name: 'Lamentations', order: 25, shortName: 'Lam', slug: '' },
    { name: 'Ezekiel', order: 26, shortName: 'Ezek', slug: '' },
    { name: 'Daniel', order: 27, shortName: 'Dan', slug: '' },
    { name: 'Hosea', order: 28, shortName: 'Hos', slug: '' },
    { name: 'Joel', order: 29, shortName: 'Joel', slug: '' },
    { name: 'Amos', order: 30, shortName: 'Amos', slug: '' },
    { name: 'Obadiah', order: 31, shortName: 'Obad', slug: '' },
    { name: 'Jonah', order: 32, shortName: 'Jonah', slug: '' },
    { name: 'Micah', order: 33, shortName: 'Micah', slug: '' },
    { name: 'Nahum', order: 34, shortName: 'Nah', slug: '' },
    { name: 'Habakkuk', order: 35, shortName: 'Hab', slug: '' },
    { name: 'Zephaniah', order: 36, shortName: 'Zeph', slug: '' },
    { name: 'Haggai', order: 37, shortName: 'Haggai', slug: '' },
    { name: 'Zechariah', order: 38, shortName: 'Zech', slug: '' },
    { name: 'Malachi', order: 39, shortName: 'Mal', slug: '' },
    { name: 'Matthew', order: 40, shortName: 'Matt', slug: '' },
    { name: 'Mark', order: 41, shortName: 'Mark', slug: '' },
    { name: 'Luke', order: 42, shortName: 'Luke', slug: '' },
    { name: 'John', order: 43, shortName: 'John', slug: '' },
    { name: 'Acts', order: 44, shortName: 'Acts', slug: '' },
    { name: 'Romans', order: 45, shortName: 'Rom', slug: '' },
    { name: '1 Corinthians', order: 46, shortName: '1 Cor', slug: '' },
    { name: '2 Corinthians', order: 47, shortName: '2 Cor', slug: '' },
    { name: 'Galatians', order: 48, shortName: 'Gal', slug: '' },
    { name: 'Ephesians', order: 49, shortName: 'Eph', slug: '' },
    { name: 'Philippians', order: 50, shortName: 'Phil', slug: '' },
    { name: 'Colossians', order: 51, shortName: 'Col', slug: '' },
    { name: '1 Thessalonians', order: 52, shortName: '1 Thess', slug: '' },
    { name: '2 Thessalonians', order: 53, shortName: '2 Thess', slug: '' },
    { name: '1 Timothy', order: 54, shortName: '1 Tim', slug: '' },
    { name: '2 Timothy', order: 55, shortName: '2 Tim', slug: '' },
    { name: 'Titus', order: 56, shortName: 'Titus', slug: '' },
    { name: 'Philemon', order: 57, shortName: 'Philem', slug: '' },
    { name: 'Hebrews', order: 58, shortName: 'Heb', slug: '' },
    { name: 'James', order: 59, shortName: 'James', slug: '' },
    { name: '1 Peter', order: 60, shortName: '1 Pet', slug: '' },
    { name: '2 Peter', order: 61, shortName: '2 Pet', slug: '' },
    { name: '1 John', order: 62, shortName: '1 John', slug: '' },
    { name: '2 John', order: 63, shortName: '2 John', slug: '' },
    { name: '3 John', order: 64, shortName: '3 John', slug: '' },
    { name: 'Jude', order: 65, shortName: 'Jude', slug: '' },
    { name: 'Revelation', order: 66, shortName: 'Rev', slug: '' },
  ].map((i) => {
    if (i.slug === '') {
      i.slug = i.name.toLowerCase().replace(' ', '-')
    }
    return i
  })

  // Chapter list fetched from https://versenotes.org/a-list-of-books-in-the-bible-by-number-of-chapters/
  const csvPath = path.resolve(dirname, 'bible-chapters.csv')
  fs.readFile(csvPath, async (err, data) => {
    if (data) {
      const fullChaptersList = data
        .toString()
        .replace(/\r\n/g, '\n') // Unify line endings
        .split('\n')
        .map((l) => l.split(','))

      const chaptersList: Array<Array<{ chapterNum: number; numVerses: number }>> = []
      let currentBook = 'Genesis'
      let currentChaptersList: Array<{ chapterNum: number; numVerses: number }> = []

      for (let index = 1; index < fullChaptersList.length; index++) {
        const currentLine = fullChaptersList[index]
        const currentLineBook = currentLine[0]
        const currentChapterNum = parseInt(currentLine[1])
        const currentChapterLen = parseInt(currentLine[2])
        if (currentBook !== currentLineBook) {
          chaptersList.push(currentChaptersList)
          currentBook = currentLineBook
          currentChaptersList = []
        }

        currentChaptersList.push({ chapterNum: currentChapterNum, numVerses: currentChapterLen })
      }
      chaptersList.push(currentChaptersList)

      for (let bookIndex = 0; bookIndex < booksInfos.length; bookIndex++) {
        const bookInfo = booksInfos[bookIndex]
        const bookData = {
          id: bookInfo.order,
          name: bookInfo.name,
          order: bookInfo.order,
          shortName: bookInfo.shortName,
          slug: bookInfo.slug,
        }
        payload.logger.info(`Seeding ${bookInfo.name}...`)
        const bookRecord = await payload.create({
          collection: 'bible-books',
          data: bookData,
        })

        const chaptersInfos = chaptersList[bookIndex]
        for (let chapterIndex = 0; chapterIndex < chaptersInfos.length; chapterIndex++) {
          const chapterInfo = chaptersInfos[chapterIndex]

          let chapterName = bookInfo.name
          const globalOrder = bookInfo.order * 1000 + chapterInfo.chapterNum
          let shortName = bookInfo.shortName
          let slug = bookInfo.slug
          let hasNoChapters = true
          if (chaptersInfos.length > 1) {
            chapterName = `${bookInfo.name} ${chapterInfo.chapterNum}`
            shortName = `${bookInfo.shortName} ${chapterInfo.chapterNum}`
            slug = `${bookInfo.slug}-${chapterInfo.chapterNum}`
            hasNoChapters = false
          }
          const chapterData = {
            id: globalOrder,
            book: bookRecord.id,
            name: chapterName,
            order: chapterInfo.chapterNum,
            globalOrder: globalOrder,
            shortName: shortName,
            slug: slug,
            hasNoChapters: hasNoChapters,
            verses: chapterInfo.numVerses,
          }
          await payload.create({
            collection: 'bible-chapters',
            data: chapterData,
          })
        }
      }
      payload.logger.info('Seeded database successfully!')
    } else {
      payload.logger.info(err)
    }
  })
}

export const seedImages = async ({
  payload,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding images...')

  const globalDefaults = await payload.findGlobal({
    slug: 'defaults',
  })
  if (globalDefaults.defaultCoverImage) {
    payload.logger.info('Images already seeded.')
  }
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL!

  const defaultSquareSvgList = await payload.find({
    collection: 'cover-image-svgs',
    where: {
      guid: {
        equals: '2f1b26ba-e4d6-450d-ae59-88441d2cae02',
      },
    },
  })
  let defaultSquareSvg: CoverImageSvg | null = null
  if (defaultSquareSvgList?.docs?.length > 0) {
    defaultSquareSvg = defaultSquareSvgList.docs[0]
  } else {
    const squareSvgBlob = await fetch(
      `${baseUrl}/static/dpcPodcastGenericLogo_plainSquare.svg`,
    ).then((r) => r.blob())
    const squareSvgBuffer = Buffer.from(await squareSvgBlob.arrayBuffer())
    defaultSquareSvg = await payload.create({
      collection: 'cover-image-svgs',
      data: {
        alt: 'DPC Sermons Generic Logo Square',
        svgFocalPoint: 'center-center',
        filename: 'dpcPodcastGenericLogo_plainSquare.svg',
        guid: '2f1b26ba-e4d6-450d-ae59-88441d2cae02',
      },
      file: {
        data: squareSvgBuffer,
        mimetype: 'image/svg+xml',
        name: 'dpcPodcastGenericLogo_plainSquare.svg',
        size: squareSvgBlob.size,
      },
    })
  }

  const defaultCardSvgList = await payload.find({
    collection: 'cover-image-svgs',
    where: {
      guid: {
        equals: '4ffd2f86-ad90-4285-905a-0faee51d4c5b',
      },
    },
  })
  let defaultCardSvg: CoverImageSvg | null = null
  if (defaultCardSvgList?.docs?.length > 0) {
    defaultCardSvg = defaultSquareSvgList.docs[0]
  } else {
    const cardSvgBlob = await fetch(`${baseUrl}/static/dpcPodcastGenericLogo_plain.svg`).then((r) =>
      r.blob(),
    )
    const cardSvgBuffer = Buffer.from(await cardSvgBlob.arrayBuffer())
    defaultCardSvg = await payload.create({
      collection: 'cover-image-svgs',
      data: {
        alt: 'DPC Sermons Generic Logo',
        svgFocalPoint: 'center-center',
        filename: 'dpcPodcastGenericLogo_plain.svg',
        guid: '4ffd2f86-ad90-4285-905a-0faee51d4c5b',
      },
      file: {
        data: cardSvgBuffer,
        mimetype: 'image/svg+xml',
        name: 'dpcPodcastGenericLogo_plainCard.svg',
        size: cardSvgBlob.size,
      },
    })
  }

  if (defaultCardSvg !== null && defaultSquareSvg != null) {
    const cardImageBlob = await fetch(`${baseUrl}/static/dpcPodcastGenericLogo_plain.png`).then(
      (r) => r.blob(),
    )
    const cardImageBuffer = Buffer.from(await cardImageBlob.arrayBuffer())
    const defaultCardImage = await payload.create({
      collection: 'cover-images',
      data: {
        name: 'DPC Sermons (generic logo)',
        alt: 'DPC Sermons (generic logo)',
        purpose: ['hub-image', 'series-image', 'other'],
        squareSvg: defaultSquareSvg.id,
        cardSvg: defaultCardSvg.id,
        filename: 'dpcPodcastGenericLogo.png',
        guid: '4ffd2f86-ad90-4285-905a-0faee51d4c5b',
      },
      file: {
        data: cardImageBuffer,
        mimetype: 'image/png',
        name: 'dpcPodcastGenericLogo.png',
        size: cardImageBlob.size,
      },
    })
    await payload.updateGlobal({
      slug: 'defaults',
      data: {
        defaultCoverImage: defaultCardImage.id,
      },
    })
    payload.logger.info('Seeded images')
  }

  return
}

type SeriesJson = {
  string: {
    title: string
    date: string
    imageUrl: string
    episodes: {
      author: string
      biblePassage: string
      dateFormatted: string
      dateRaw: string
      htmlFile: string
      length: string
      lengthTime: string
      lengthTimeSeconds: number
      longTitle: string
      mp3File: string
      series: string
      subtitle: string
      title: string
      vimeoUrl: string
    }[]
  }
}

export const seedEpisodes = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  const filename = fileURLToPath(import.meta.url)
  const dirname = path.dirname(filename)

  const jsonPath = path.resolve(dirname, 'groupedBySeries.json')
  const jsonData = readFileSync(jsonPath)
  const data: SeriesJson = JSON.parse(jsonData.toString())

  const slugFormat = (val: string): string =>
    val
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
      .toLowerCase()

  const authorFind = payload.find({
    collection: 'speakers',
  })
  const authorsMap = new Map<string, number>()
  ;(await authorFind).docs.forEach((a) => {
    if (typeof a.name === 'string') {
      authorsMap.set(a.name, a.id)
    }
  })

  const pl = req.payload

  const seriesKeys = Object.keys(data)
  for (let index = 0; index < seriesKeys.length; index++) {
    const seriesOb = data[seriesKeys[index]]
    let seriesId: number | null = null
    if (seriesOb.title && seriesOb.title.trim().length > 2) {
      const trimmedTitle = seriesOb.title.trim()
      payload.logger.info(`Adding series: ${seriesOb.title}`)
      const existingSeries = await pl.find({
        collection: 'series',
        where: {
          title: {
            equals: trimmedTitle,
          },
        },
      })
      if (existingSeries.totalDocs > 0) {
        seriesId = existingSeries.docs[0].id
      } else {
        const createResult = await pl.create({
          collection: 'series',
          data: {
            title: trimmedTitle,
            seriesDate: seriesOb.date + 'T00:00:00.000Z',
            seriesImage: 1,
            slug: slugFormat(seriesOb.date.substring(0, 8) + seriesOb.title),
            expandedTitle: seriesOb.title,
          },
        })
        seriesId = createResult.id
      }
    }
    for (let episodeIndex = 0; episodeIndex < seriesOb.episodes.length; episodeIndex++) {
      const ep = seriesOb.episodes[episodeIndex]

      let episodeTitle = ep.title
      if (
        (!episodeTitle || episodeTitle.trim().length < 2) &&
        ep.biblePassage &&
        ep.biblePassage.length > 2
      ) {
        episodeTitle = ep.biblePassage.trim()
      }

      let authorId: number | undefined = undefined
      if (ep.author && ep.author.length > 0 && authorsMap.has(ep.author)) {
        authorId = authorsMap.get(ep.author)
      } else {
        const authorCreateResult = await pl.create({
          collection: 'speakers',
          data: {
            name: ep.author,
          },
        })
        authorsMap.set(ep.author, authorCreateResult.id)
        authorId = authorCreateResult.id
      }

      payload.logger.info(`Adding episode: ${episodeTitle} for ${seriesId} | '${ep.vimeoUrl}'`)

      let videoFormat: 'none' | 'vimeo' = 'none'
      if (ep.vimeoUrl && ep.vimeoUrl.length > 0) {
        videoFormat = 'vimeo'
      }
      try {
        await pl.create({
          collection: 'episodes',
          data: {
            title: episodeTitle,
            subtitle: ep.subtitle,
            series: seriesId,
            biblePassageText: ep.biblePassage,
            speaker: authorId,
            sermonDate: ep.dateFormatted + 'T00:00:00.000Z',
            sermonDateYear: parseInt(ep.dateFormatted.substring(0, 4)),
            videoFormat: videoFormat,
            videoUrl: ep.vimeoUrl,
            audioFormat: 'linked',
            linkedAudioUrl: ep.mp3File,
            linkedAudioFileSize: parseInt(ep.length),
            linkedAudioFiletype: 'audio/mpeg',
            linkedAudioLength: ep.lengthTimeSeconds,
            slug: slugFormat(ep.dateFormatted + '-' + episodeTitle),
            fullTitle: seriesOb.fullTitle,
            _status: 'published',
          },
        })
      } catch (e) {
        payload.logger.info({ e })
        throw e
      }
    }
  }
}
