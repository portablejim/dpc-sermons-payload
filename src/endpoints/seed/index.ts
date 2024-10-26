import fs from 'fs'
import path from 'path'
import type { Payload, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
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
  ].map(i => {
    if (i.slug === '') {
      i.slug = i.name.toLowerCase().replace(' ', '-')
    }
    return i
  })

  // Chapter list fetched from https://versenotes.org/a-list-of-books-in-the-bible-by-number-of-chapters/
  let csvPath = path.resolve(dirname, 'bible-chapters.csv')
  fs.readFile(csvPath, async (err, data) => {
    if (data) {
      let fullChaptersList = data
        .toString()
        .replace(/\r\n/g, '\n') // Unify line endings
        .split('\n')
        .map(l => l.split(','))

      let chaptersList: Array<Array<{ chapterNum: number; numVerses: number }>> = []
      let currentBook = 'Genesis'
      let currentChaptersList: Array<{ chapterNum: number; numVerses: number }> = []

      for (let index = 1; index < fullChaptersList.length; index++) {
        const currentLine = fullChaptersList[index]
        const currentLineBook = currentLine[0]
        const currentChapterNum = parseInt(currentLine[1])
        const currentChapterLen = parseInt(currentLine[1])
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
        let bookData = {
          id: bookInfo.order,
          name: bookInfo.name,
          order: bookInfo.order,
          shortName: bookInfo.shortName,
          slug: bookInfo.slug,
        }
        payload.logger.info(`Seeding ${bookInfo.name}...`)
        let bookRecord = await payload.create({
          collection: 'bible-books',
          data: bookData,
        })

        let chaptersInfos = chaptersList[bookIndex]
        for (let chapterIndex = 0; chapterIndex < chaptersInfos.length; chapterIndex++) {
          let chapterInfo = chaptersInfos[chapterIndex]

          let chapterName = bookInfo.name
          let globalOrder = bookInfo.order * 1000 + chapterInfo.chapterNum
          let shortName = bookInfo.shortName
          let slug = bookInfo.slug
          let hasNoChapters = true
          if (chaptersInfos.length > 1) {
            chapterName = `${bookInfo.name} ${chapterInfo.chapterNum}`
            shortName = `${bookInfo.shortName} ${chapterInfo.chapterNum}`
            slug = `${bookInfo.slug}-${chapterInfo.chapterNum}`
            hasNoChapters = false
          }
          let chapterData = {
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
