import { readFile, readFileSync } from 'fs'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const require = createRequire(import.meta.url)
var bcv_parser = require('./en_bcv_parser.min.cjs').bcv_parser
var bcv = new bcv_parser()

//let episodeList = JSON.parse(readFileSync(__dirname + '/episodes-local.json').toString())
let episodeList = await (await fetch(`${process.env.API_URL}/api/episodes?limit=0`)).json()

let bookIds = {
  Gen: 1,
  Exod: 2,
  Lev: 3,
  Num: 4,
  Deut: 5,
  Josh: 6,
  Judg: 7,
  Ruth: 8,
  '1Sam': 9,
  '2Sam': 10,
  '1Kgs': 11,
  '2Kgs': 12,
  '1Chr': 13,
  '2Chr': 14,
  Ezra: 15,
  Neh: 16,
  Esth: 17,
  Job: 18,
  Ps: 19,
  Prov: 20,
  Eccl: 21,
  Song: 22,
  Isa: 23,
  Jer: 24,
  Lam: 25,
  Ezek: 26,
  Dan: 27,
  Hos: 28,
  Joel: 29,
  Amos: 30,
  Obad: 31,
  Jonah: 32,
  Mic: 33,
  Nah: 34,
  Hab: 35,
  Zeph: 36,
  Hag: 37,
  Zech: 38,
  Mal: 39,
  Matt: 40,
  Mark: 41,
  Luke: 42,
  John: 43,
  Acts: 44,
  Rom: 45,
  '1Cor': 46,
  '2Cor': 47,
  Gal: 48,
  Eph: 49,
  Phil: 50,
  Col: 51,
  '1Thess': 52,
  '2Thess': 53,
  '1Tim': 54,
  '2Tim': 55,
  Titus: 56,
  Phlm: 57,
  Heb: 58,
  Jas: 59,
  '1Pet': 60,
  '2Pet': 61,
  '1John': 62,
  '2John': 63,
  '3John': 64,
  Jude: 65,
  Rev: 66,
}

bcv.set_options({
  consecutive_combination_strategy: 'separate',
  osis_compaction_strategy: 'bcv',
  passage_existence_strategy: 'bcv',
})

const loginReq = await fetch(`${process.env.API_URL}/api/users/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: process.env.API_USERNAME,
    password: process.env.API_PASSWORD,
  }),
})
const loginData = await loginReq.json()

let toUpdate = []

for (let eIndex = 0; eIndex < episodeList.docs.length; eIndex++) {
  const element = episodeList.docs[eIndex]
  const bText = element.biblePassageText
  if (bText === '') {
    continue
  }
  const bRef = bcv
    .parse(bText)
    .parsed_entities()
    .map((pe) => pe.entities)
  if (bRef.length <= 0) {
    continue
  }
  console.log({
    passageExists: !!element.biblePassages,
    len: element.biblePassages.length,
    lenGt0: element.biblePassages.length > 0,
    passages: element.biblePassages,
  })
  if (element.biblePassages && element.biblePassages.length > 0) {
    continue
  }
  let bParsedRefs = bRef[0]
    .map((ref) => {
      if (ref.start.b != ref.end.b || ref.start.c > ref.end.c) {
        return []
      } else if (ref.start.c === ref.end.c) {
        // Single chapter
        let bookNum = bookIds[ref.start.b]
        let chapterId = bookNum * 1000 + ref.start.c
        return [{ chapter: chapterId, verseStart: ref.start.v, verseEnd: ref.end.v }]
      } else {
        // Multi chapter
        let bookNum = bookIds[ref.start.b]
        let startVerse = ref.start.v
        let currentChapter = ref.start.c
        let chapterId = bookNum * 1000 + currentChapter
        let translation_info = bcv.translation_info()
        let output = []
        while (currentChapter < ref.end.c) {
          let endVerse = translation_info.chapters[ref.start.b][currentChapter - 1]
          output.push({ chapter: chapterId, verseStart: startVerse, verseEnd: endVerse })
          startVerse = 1
          currentChapter += 1
          chapterId = bookNum * 1000 + currentChapter
        }
        output.push({ chapter: chapterId, verseStart: startVerse, verseEnd: ref.end.v })

        return output
      }
    })
    .flat()
  let targetObject = {
    biblePassages: bParsedRefs,
  }
  let targetObjectStr = JSON.stringify(targetObject)
  toUpdate.push(targetObject)
  const req = await fetch(`${process.env.API_URL}/api/episodes/${element.id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${loginData.token}`,
    },
    body: targetObjectStr,
  })
  const data = await req.json()
  console.dir({ body: targetObjectStr, data }, { depth: null })
  break
}
