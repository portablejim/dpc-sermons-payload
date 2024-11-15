import { desc, eq } from 'drizzle-orm/expressions'
import { existsSync, readFileSync } from 'fs'
import { type PayloadHandler } from 'payload'

export const coverImage: PayloadHandler = async (req): Promise<Response> => {
  const { payload, routeParams } = req

  let imageId: string = <string>routeParams?.id ?? ''
  let imageVersion = routeParams?.versionId ?? ''
  let imageType = routeParams?.type ?? ''
  let filename = routeParams?.filename ?? ''

  let fileData = await payload.findByID({
    collection: 'cover-images',
    id: imageId,
  })

  if (
    imageType === 'thumbnail' &&
    fileData?.sizes?.thumbnail?.filename != undefined &&
    fileData?.sizes?.thumbnail?.filename != null
  ) {
    let candidateFilePath = `${process.env.APP_PUBLIC__DIR_PATH}/cover-images/${fileData?.sizes?.thumbnail?.filename}`
    if (existsSync(candidateFilePath)) {
      let fileBytes = readFileSync(candidateFilePath)
      return new Response(fileBytes, {
        headers: new Headers({
          'Content-Type': fileData?.sizes?.thumbnail?.mimeType ?? 'octet/stream',
          'Cache-Control': 'public, max-age=86400, stale-if-error=302400',
        }),
      })
    } else {
      return Response.error()
    }
  }
  if (
    imageType === 'thumbnail_webp' &&
    fileData?.sizes?.thumbnail_webp?.filename != undefined &&
    fileData?.sizes?.thumbnail_webp?.filename != null
  ) {
    let candidateFilePath = `${process.env.APP_PUBLIC__DIR_PATH}/cover-images/${fileData?.sizes?.thumbnail_webp?.filename}`
    if (existsSync(candidateFilePath)) {
      let fileBytes = readFileSync(candidateFilePath)
      return new Response(fileBytes, {
        headers: new Headers({
          'Content-Type': fileData?.sizes?.thumbnail_webp?.mimeType ?? 'octet/stream',
          'Cache-Control': 'public, max-age=86400, stale-if-error=302400',
        }),
      })
    } else {
      return Response.error()
    }
  }
  if (
    imageType === 'thumbnail_large' &&
    fileData?.sizes?.thumbnail_large?.filename != undefined &&
    fileData?.sizes?.thumbnail_large?.filename != null
  ) {
    let candidateFilePath = `${process.env.APP_PUBLIC__DIR_PATH}/cover-images/${fileData?.sizes?.thumbnail_large?.filename}`
    if (existsSync(candidateFilePath)) {
      let fileBytes = readFileSync(candidateFilePath)
      return new Response(fileBytes, {
        headers: new Headers({
          'Content-Type': fileData?.sizes?.thumbnail_large?.mimeType ?? 'octet/stream',
          'Cache-Control': 'public, max-age=86400, stale-if-error=302400',
        }),
      })
    } else {
      return Response.error()
    }
  }
  if (
    imageType === 'card' &&
    fileData?.sizes?.card?.filename != undefined &&
    fileData?.sizes?.card?.filename != null
  ) {
    let candidateFilePath = `${process.env.APP_PUBLIC__DIR_PATH}/cover-images/${fileData?.sizes?.card?.filename}`
    if (existsSync(candidateFilePath)) {
      let fileBytes = readFileSync(candidateFilePath)
      return new Response(fileBytes, {
        headers: new Headers({
          'Content-Type': fileData?.sizes?.card?.mimeType ?? 'octet/stream',
          'Cache-Control': 'public, max-age=86400, stale-if-error=302400',
        }),
      })
    } else {
      return Response.error()
    }
  }
  if (
    imageType === 'card_webp' &&
    fileData?.sizes?.card_webp?.filename != undefined &&
    fileData?.sizes?.card_webp?.filename != null
  ) {
    let candidateFilePath = `${process.env.APP_PUBLIC__DIR_PATH}/cover-images/${fileData?.sizes?.card_webp?.filename}`
    if (existsSync(candidateFilePath)) {
      let fileBytes = readFileSync(candidateFilePath)
      return new Response(fileBytes, {
        headers: new Headers({
          'Content-Type': fileData?.sizes?.card_webp?.mimeType ?? 'octet/stream',
          'Cache-Control': 'public, max-age=86400, stale-if-error=302400',
        }),
      })
    } else {
      return Response.error()
    }
  }
  if (
    imageType === 'card_large' &&
    fileData?.sizes?.card_large?.filename != undefined &&
    fileData?.sizes?.card_large?.filename != null
  ) {
    let candidateFilePath = `${process.env.APP_PUBLIC__DIR_PATH}/cover-images/${fileData?.sizes?.card_large?.filename}`
    if (existsSync(candidateFilePath)) {
      let fileBytes = readFileSync(candidateFilePath)
      return new Response(fileBytes, {
        headers: new Headers({
          'Content-Type': fileData?.sizes?.card_large?.mimeType ?? 'octet/stream',
          'Cache-Control': 'public, max-age=86400, stale-if-error=302400',
        }),
      })
    } else {
      return Response.error()
    }
  }
  if (
    imageType === 'largeSquare' &&
    fileData?.sizes?.largeSquare?.filename != undefined &&
    fileData?.sizes?.largeSquare?.filename != null
  ) {
    let candidateFilePath = `${process.env.APP_PUBLIC__DIR_PATH}/cover-images/${fileData?.sizes?.largeSquare?.filename}`
    if (existsSync(candidateFilePath)) {
      let fileBytes = readFileSync(candidateFilePath)
      let fileByteLength = fileBytes.byteLength
      return new Response(fileBytes, {
        headers: new Headers({
          'Content-Type': fileData?.sizes?.largeSquare?.mimeType ?? 'octet/stream',
          //'Content-Length': `${fileBytes.byteLength}`,
          'Cache-Control': 'public, max-age=86400, stale-if-error=302400',
        }),
      })
    } else {
      return Response.error()
    }
  }

  return Response.error()
}
