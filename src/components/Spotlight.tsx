import { getListings, getCardImage } from '@/lib/listings'
import SpotlightCard from './SpotlightCard'

export default async function Spotlight() {
  let listings = await getListings({ limit: 1, featured: true })
  if (!listings.length) listings = await getListings({ limit: 1 })
  if (!listings.length) return null
  const listing = listings[0]
  return <SpotlightCard listing={listing} image={getCardImage(listing)} />
}
