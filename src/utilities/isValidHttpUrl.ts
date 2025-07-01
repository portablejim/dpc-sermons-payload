export const isValidHttpUrl = (candidateString: string | URL | null | undefined) => {
  let url: URL

  if (candidateString === null || candidateString === undefined) {
    return false
  }

  try {
    url = new URL(candidateString)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}
