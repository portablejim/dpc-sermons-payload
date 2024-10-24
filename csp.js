const policies = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://maps.googleapis.com',
    'https://*.vimeocdn.com',
    'https://f.vimeocdn.com',
    'https://vimeocdn.com',
  ],
  'child-src': ["'self'"],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': ["'self'", 'https://raw.githubusercontent.com', 'data:', 'https://sermons.dpc.org.au'],
  'font-src': ["'self'"],
  'frame-src': ["'self'", 'https://vimeo.com', 'https://player.vimeo.com'],
  'connect-src': ["'self'", 'https://maps.googleapis.com', 'https://sermons.dpc.org.au'],
  'media-src': ["'self'", 'https://sermons.dpc.org.au'],
}

module.exports = Object.entries(policies)
  .map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key} ${value.join(' ')}`
    }
    return ''
  })
  .join('; ')
