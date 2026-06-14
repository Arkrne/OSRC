export type Property = {
  id: number
  name: string
  developer: string
  type: 'House & Lot' | 'Townhouse' | 'Condo'
  location: string
  region: 'Metro Manila' | 'Cavite' | 'Laguna' | 'Bulacan'
  price: number
  priceDisplay: string
  floorArea: number
  lotArea: number
  bedrooms: number
  bathrooms: number
  status: 'Ready for Occupancy' | 'Pre-Selling'
  pagibigEligible: boolean
  monthlyAmortization: string
  description: string
  features: string[]
  image: string
  featured?: boolean
}

export const properties: Property[] = [
  {
    id: 1,
    name: 'Camella Bucandala',
    developer: 'Camella Homes',
    type: 'House & Lot',
    location: 'Bucandala, Imus, Cavite',
    region: 'Cavite',
    price: 2450000,
    priceDisplay: '₱2,450,000',
    floorArea: 44,
    lotArea: 88,
    bedrooms: 3,
    bathrooms: 2,
    status: 'Ready for Occupancy',
    pagibigEligible: true,
    monthlyAmortization: '₱12,800/mo',
    description:
      "A well-built 3-bedroom home in one of Imus's most established communities. Complete amenities including a clubhouse, swimming pool, and 24/7 security.",
    features: ['Gated community', 'Clubhouse & pool', '24/7 security', 'Near SLEX/CAVITEX'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    featured: true,
  },
  {
    id: 2,
    name: 'Lumina Imus',
    developer: 'Lumina Homes',
    type: 'House & Lot',
    location: 'Imus, Cavite',
    region: 'Cavite',
    price: 1100000,
    priceDisplay: '₱1,100,000',
    floorArea: 24,
    lotArea: 54,
    bedrooms: 2,
    bathrooms: 1,
    status: 'Ready for Occupancy',
    pagibigEligible: true,
    monthlyAmortization: '₱5,800/mo',
    description:
      'An entry-level home perfect for first-time buyers. Lumina Imus offers quality construction at an unbeatable price point.',
    features: ['Concrete construction', '24/7 security', 'Near schools & market', 'Low down payment'],
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
  },
  {
    id: 3,
    name: 'Lancaster New City',
    developer: 'AboitizLand',
    type: 'House & Lot',
    location: 'Kawit, Cavite',
    region: 'Cavite',
    price: 1850000,
    priceDisplay: '₱1,850,000',
    floorArea: 40,
    lotArea: 72,
    bedrooms: 3,
    bathrooms: 2,
    status: 'Ready for Occupancy',
    pagibigEligible: true,
    monthlyAmortization: '₱9,700/mo',
    description:
      'One of the largest master-planned communities in Cavite. Spacious 3-bedroom home with generous lot and complete community amenities.',
    features: ['Planned township', 'Commercial hub inside', 'Shuttle to MRT', 'Near churches & schools'],
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
  },
  {
    id: 4,
    name: 'Bria Homes San Jose del Monte',
    developer: 'Bria Homes',
    type: 'House & Lot',
    location: 'San Jose del Monte, Bulacan',
    region: 'Bulacan',
    price: 960000,
    priceDisplay: '₱960,000',
    floorArea: 22,
    lotArea: 54,
    bedrooms: 2,
    bathrooms: 1,
    status: 'Ready for Occupancy',
    pagibigEligible: true,
    monthlyAmortization: '₱5,000/mo',
    description:
      'The most affordable entry point for families. Bria Homes delivers quality concrete construction with fast Pag-IBIG processing.',
    features: ['All-concrete construction', 'Secured village', 'Near transport terminals', 'Easy Metro Manila access'],
    image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
  },
  {
    id: 5,
    name: 'Crown Asia Citta Italia',
    developer: 'Crown Asia',
    type: 'Townhouse',
    location: 'Bacoor, Cavite',
    region: 'Cavite',
    price: 3750000,
    priceDisplay: '₱3,750,000',
    floorArea: 65,
    lotArea: 60,
    bedrooms: 3,
    bathrooms: 2,
    status: 'Ready for Occupancy',
    pagibigEligible: true,
    monthlyAmortization: '₱19,700/mo',
    description:
      'Inspired by Italian architecture, Citta Italia is a premium themed community in Bacoor. Mediterranean design with a modern open-plan interior.',
    features: ['Italian-themed village', 'Piazza & fountain', 'Near SM Bacoor', 'Church inside village'],
    image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
    featured: true,
  },
  {
    id: 6,
    name: 'Futura by Filinvest',
    developer: 'Filinvest Land',
    type: 'House & Lot',
    location: 'Malolos, Bulacan',
    region: 'Bulacan',
    price: 1650000,
    priceDisplay: '₱1,650,000',
    floorArea: 42,
    lotArea: 80,
    bedrooms: 3,
    bathrooms: 2,
    status: 'Pre-Selling',
    pagibigEligible: true,
    monthlyAmortization: '₱8,700/mo',
    description:
      'Futura is Filinvest\'s trusted affordable housing brand. Wide 80 sqm lots in a gated Malolos community — pre-selling prices still available.',
    features: ['Wide lots', 'Gated community', 'Near NLEX Malolos exit', 'Deferred payment scheme'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  },
  {
    id: 7,
    name: 'Lessandra General Trias',
    developer: 'Lessandra',
    type: 'House & Lot',
    location: 'General Trias, Cavite',
    region: 'Cavite',
    price: 1050000,
    priceDisplay: '₱1,050,000',
    floorArea: 24,
    lotArea: 60,
    bedrooms: 2,
    bathrooms: 1,
    status: 'Ready for Occupancy',
    pagibigEligible: true,
    monthlyAmortization: '₱5,500/mo',
    description:
      'Wider lots, well-paved roads, and a strong community vibe. General Trias is one of Cavite\'s fastest-growing cities with booming commercial activity.',
    features: ['Wider lots', 'Basketball court', 'Convenience store inside', 'Near CALAX exit'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  },
  {
    id: 8,
    name: 'Avida Settings Nuvali',
    developer: 'Avida Land (Ayala)',
    type: 'House & Lot',
    location: 'Sta. Rosa, Laguna',
    region: 'Laguna',
    price: 4250000,
    priceDisplay: '₱4,250,000',
    floorArea: 75,
    lotArea: 120,
    bedrooms: 3,
    bathrooms: 2,
    status: 'Pre-Selling',
    pagibigEligible: true,
    monthlyAmortization: '₱22,400/mo',
    description:
      'Backed by Ayala Land, Avida Settings Nuvali offers premium living inside Nuvali eco-city. Larger-than-average floor plans with a beautiful lake-view community.',
    features: ['Inside Nuvali eco-city', 'Ayala Land quality', 'Near SLEX Sta. Rosa', 'Evia & Solenad malls nearby'],
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
    featured: true,
  },
  {
    id: 9,
    name: 'Deca Homes Marilao',
    developer: '8990 Housing',
    type: 'House & Lot',
    location: 'Marilao, Bulacan',
    region: 'Bulacan',
    price: 890000,
    priceDisplay: '₱890,000',
    floorArea: 20,
    lotArea: 42,
    bedrooms: 2,
    bathrooms: 1,
    status: 'Ready for Occupancy',
    pagibigEligible: true,
    monthlyAmortization: '₱4,700/mo',
    description:
      'The most budget-friendly option in Bulacan. Deca Homes makes homeownership possible for minimum-wage earners through optimized Pag-IBIG financing.',
    features: ['Minimum down payment options', 'Fast Pag-IBIG processing', 'Near NLEX Marilao', 'Near Bocaue industrial area'],
    image: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80',
  },
  {
    id: 10,
    name: 'Ponticelli — Livorno Model',
    developer: 'Crown Asia',
    type: 'House & Lot',
    location: 'Bacoor, Cavite',
    region: 'Cavite',
    price: 5100000,
    priceDisplay: '₱5,100,000',
    floorArea: 120,
    lotArea: 150,
    bedrooms: 4,
    bathrooms: 3,
    status: 'Pre-Selling',
    pagibigEligible: true,
    monthlyAmortization: '₱26,900/mo',
    description:
      'Our premium flagship — a 4-bedroom home inside Crown Asia\'s upscale Italian-themed community. 150 sqm lot, 2-car garage, and high resale value.',
    features: ['2-car garage', 'Service area', 'Premium Italian community', 'High resale value'],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    featured: true,
  },
]

export const regions = ['All', 'Metro Manila', 'Cavite', 'Laguna', 'Bulacan'] as const
export const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₱1M', min: 0, max: 1000000 },
  { label: '₱1M – ₱2M', min: 1000000, max: 2000000 },
  { label: '₱2M – ₱4M', min: 2000000, max: 4000000 },
  { label: '₱4M+', min: 4000000, max: Infinity },
] as const
export const propertyTypes = ['All Types', 'House & Lot', 'Townhouse', 'Condo'] as const
export const statusOptions = ['All Status', 'Ready for Occupancy', 'Pre-Selling'] as const
