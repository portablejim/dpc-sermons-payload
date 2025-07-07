import PageTemplate, { generateMetadata } from './hub/[slug]/page'

export const dynamic = 'force-dynamic'

export default PageTemplate

export { generateMetadata }

export function generateStaticParams() {
  return []
}
