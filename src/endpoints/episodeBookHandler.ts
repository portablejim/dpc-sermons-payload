import { desc, eq } from 'drizzle-orm'
import { type PayloadHandler } from 'payload'

export const validBooks: PayloadHandler = async (req): Promise<Response> => {
  const { payload, routeParams } = req

  const episodeType = routeParams?.type ?? ''

  const episodesTable = payload.db.tables.episodes
  const episodesBiblePassagesTable = payload.db.tables.episodes_bible_passages
  const bibleChaptersTable = payload.db.tables.bible_chapters
  const bibleBooksTable = payload.db.tables.bible_books

  const yearSelect = await payload.db.drizzle
    .selectDistinct({
      book: bibleChaptersTable.book,
      bookName: bibleBooksTable.name,
      slug: bibleBooksTable.slug,
    })
    .from(bibleChaptersTable)
    .innerJoin(
      episodesBiblePassagesTable,
      eq(bibleChaptersTable.id, episodesBiblePassagesTable.chapter),
    )
    .innerJoin(episodesTable, eq(episodesTable.id, episodesBiblePassagesTable._parentID))
    .where(eq(episodesTable.episodeType, episodeType))
    .orderBy(bibleChaptersTable.book)
    .innerJoin(bibleBooksTable, eq(bibleBooksTable.id, bibleChaptersTable.book))

  const output = yearSelect //.filter(ys => typeof ys.year === 'string').map(ys => ys.year as string)

  return Response.json(output)
}

export const episodeByBookList: PayloadHandler = async (req): Promise<Response> => {
  const { payload, routeParams } = req

  const currentBook = <string | undefined>routeParams?.book ?? ''
  const episodeType = <string | undefined>routeParams?.type ?? ''

  if (currentBook === '') {
    return Response.json(
      {},
      {
        status: 404,
        statusText: 'Book not found',
      },
    )
  } else {
    const parsedBook = parseInt(currentBook)
    if (isNaN(parsedBook)) {
      return Response.json(
        {},
        {
          status: 404,
          statusText: 'Book not found',
        },
      )
    }

    const episodeFind = await payload.find({
      collection: 'episodes',
      where: {
        and: [
          {
            episodeType: {
              equals: episodeType,
            },
          },
          {
            'biblePassages.chapter.book': {
              equals: parsedBook,
            },
          },
        ],
      },
      sort: '-sermonDate',
      limit: 0,
    })
    return Response.json(episodeFind.docs)
  }
}
