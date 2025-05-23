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

  if (imageType === 'thumbnail') {
    if (
      fileData?.sizes?.thumbnail?.filename != undefined &&
      fileData?.sizes?.thumbnail?.filename != null
    ) {
      let candidateFilePath = `${process.env.APP_PUBLIC__DIR_PATH}/cover-images/${fileData?.sizes?.thumbnail?.filename}`
      if (existsSync(candidateFilePath)) {
        let fileBytes = readFileSync(candidateFilePath)
        return new Response(fileBytes, {
          status: 200,
          headers: new Headers({
            'Content-Type': fileData?.sizes?.thumbnail?.mimeType ?? 'octet/stream',
            'Cache-Control': 'public, max-age=86400, stale-if-error=302400',
          }),
        })
      } else {
        return new Response(null, {
          status: 404,
          statusText: 'Image not found',
        })
      }
    } else {
      return new Response(null, {
        status: 404,
        statusText: 'Image not found',
      })
    }
  }
  if (imageType === 'thumbnail_webp') {
    if (
      fileData?.sizes?.thumbnail_webp?.filename != undefined &&
      fileData?.sizes?.thumbnail_webp?.filename != null
    ) {
      let candidateFilePath = `${process.env.APP_PUBLIC__DIR_PATH}/cover-images/${fileData?.sizes?.thumbnail_webp?.filename}`
      payload.logger.info({ candidateFilePath })
      if (existsSync(candidateFilePath)) {
        let fileBytes = readFileSync(candidateFilePath)
        return new Response(fileBytes, {
          status: 200,
          statusText: 'Found',
          headers: new Headers({
            'Content-Type': fileData?.sizes?.thumbnail_webp?.mimeType ?? 'octet/stream',
            'Cache-Control': 'public, max-age=86400, stale-if-error=302400',
          }),
        })
      } else {
        return new Response(null, {
          status: 404,
          statusText: 'Image not found',
        })
      }
    } else {
      return new Response(null, {
        status: 404,
        statusText: 'Image not found',
      })
    }
  }
  if (imageType === 'thumbnail_large') {
    if (
      fileData?.sizes?.thumbnail_large?.filename != undefined &&
      fileData?.sizes?.thumbnail_large?.filename != null
    ) {
      let candidateFilePath = `${process.env.APP_PUBLIC__DIR_PATH}/cover-images/${fileData?.sizes?.thumbnail_large?.filename}`
      if (existsSync(candidateFilePath)) {
        let fileBytes = readFileSync(candidateFilePath)
        return new Response(fileBytes, {
          status: 200,
          statusText: 'Found',
          headers: new Headers({
            'Content-Type': fileData?.sizes?.thumbnail_large?.mimeType ?? 'octet/stream',
            'Cache-Control': 'public, max-age=86400, stale-if-error=302400',
          }),
        })
      } else {
        return new Response(null, {
          status: 404,
          statusText: 'Image not found',
        })
      }
    } else {
      return new Response(null, {
        status: 404,
        statusText: 'Image not found',
      })
    }
  }
  if (imageType === 'card') {
    if (fileData?.sizes?.card?.filename != undefined && fileData?.sizes?.card?.filename != null) {
      let candidateFilePath = `${process.env.APP_PUBLIC__DIR_PATH}/cover-images/${fileData?.sizes?.card?.filename}`
      if (existsSync(candidateFilePath)) {
        let fileBytes = readFileSync(candidateFilePath)
        return new Response(fileBytes, {
          status: 200,
          headers: new Headers({
            'Content-Type': fileData?.sizes?.card?.mimeType ?? 'octet/stream',
            'Cache-Control': 'public, max-age=86400, stale-if-error=302400',
          }),
        })
      } else {
        return new Response(null, {
          status: 404,
          statusText: 'Image not found',
        })
      }
    } else {
      return new Response(null, {
        status: 404,
        statusText: 'Image not found',
      })
    }
  }
  if (imageType === 'card_webp') {
    if (
      fileData?.sizes?.card_webp?.filename != undefined &&
      fileData?.sizes?.card_webp?.filename != null
    ) {
      let candidateFilePath = `${process.env.APP_PUBLIC__DIR_PATH}/cover-images/${fileData?.sizes?.card_webp?.filename}`
      if (existsSync(candidateFilePath)) {
        let fileBytes = readFileSync(candidateFilePath)
        return new Response(fileBytes, {
          status: 200,
          headers: new Headers({
            'Content-Type': fileData?.sizes?.card_webp?.mimeType ?? 'octet/stream',
            'Cache-Control': 'public, max-age=86400, stale-if-error=302400',
          }),
        })
      } else {
        return new Response(null, {
          status: 404,
          statusText: 'Image not found',
        })
      }
    } else {
      return new Response(null, {
        status: 404,
        statusText: 'Image not found',
      })
    }
  }
  if (imageType === 'card_large') {
    if (
      fileData?.sizes?.card_large?.filename != undefined &&
      fileData?.sizes?.card_large?.filename != null
    ) {
      let candidateFilePath = `${process.env.APP_PUBLIC__DIR_PATH}/cover-images/${fileData?.sizes?.card_large?.filename}`
      if (existsSync(candidateFilePath)) {
        let fileBytes = readFileSync(candidateFilePath)
        return new Response(fileBytes, {
          status: 200,
          headers: new Headers({
            'Content-Type': fileData?.sizes?.card_large?.mimeType ?? 'octet/stream',
            'Cache-Control': 'public, max-age=86400, stale-if-error=302400',
          }),
        })
      } else {
        return new Response(null, {
          status: 404,
          statusText: 'Image not found',
        })
      }
    } else {
      return new Response(null, {
        status: 404,
        statusText: 'Image not found',
      })
    }
  }
  if (imageType === 'largeSquare') {
    if (
      fileData?.sizes?.largeSquare?.filename != undefined &&
      fileData?.sizes?.largeSquare?.filename != null
    ) {
      let candidateFilePath = `${process.env.APP_PUBLIC__DIR_PATH}/cover-images/${fileData?.sizes?.largeSquare?.filename}`
      if (existsSync(candidateFilePath)) {
        let fileBytes = readFileSync(candidateFilePath)
        let fileByteLength = fileBytes.byteLength
        return new Response(fileBytes, {
          status: 200,
          headers: new Headers({
            'Content-Type': fileData?.sizes?.largeSquare?.mimeType ?? 'octet/stream',
            //'Content-Length': `${fileBytes.byteLength}`,
            'Cache-Control': 'public, max-age=86400, stale-if-error=302400',
          }),
        })
      } else {
        return new Response(null, {
          status: 404,
          statusText: 'Image not found',
        })
      }
    } else {
      return new Response(null, {
        status: 404,
        statusText: 'Image not found',
      })
    }
  }

  return Response.error()
}

export const coverImageSvg: PayloadHandler = async (req): Promise<Response> => {
  const { payload, routeParams } = req

  let imageId: string = <string>routeParams?.id ?? ''
  let imageVersion = routeParams?.versionId ?? ''
  let filename = routeParams?.filename ?? ''

  let fileData = await payload.findByID({
    collection: 'cover-image-svgs',
    id: imageId,
  })

  let candidateFilePath = `${process.env.APP_PUBLIC__DIR_PATH}/cover-image-svg/${fileData?.filename}`
  if (existsSync(candidateFilePath)) {
    let fileBytes = readFileSync(candidateFilePath)
    let fileByteLength = fileBytes.byteLength
    return new Response(fileBytes, {
      status: 200,
      headers: new Headers({
        'Content-Type': fileData?.mimeType ?? 'octet/stream',
        //'Content-Length': `${fileBytes.byteLength}`,
        'Cache-Control': 'public, max-age=86400, stale-if-error=302400',
      }),
    })
  } else {
    return new Response(null, {
      status: 404,
      statusText: 'Image not found',
    })
  }

  return Response.json({ error: 'Other error' })
}
