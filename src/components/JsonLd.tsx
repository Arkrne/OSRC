const SITE_URL = 'https://orangesquarerealty.com.ph'

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Orange Square Realty Corporation',
  alternateName: 'OSRC',
  description:
    'Pag-IBIG housing loan specialists helping Filipino families buy their first home. We handle loan processing, property matching, and pre-qualification across Cavite, Laguna, Bulacan, and Metro Manila.',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.jpg`,
  },
  image: `${SITE_URL}/opengraph-image`,
  telephone: '+63-956-884-3373',
  email: 'inquiries@orangesquarerealty.com.ph',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '#12 Madrona St., Phase 1, Greenwoods Executive Village',
    addressLocality: 'Cainta',
    addressRegion: 'Rizal',
    postalCode: '1900',
    addressCountry: 'PH',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 14.5833,
    longitude: 121.1167,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '08:00',
    closes: '18:00',
  },
  areaServed: [
    { '@type': 'State', name: 'Cavite',      sameAs: 'https://en.wikipedia.org/wiki/Cavite' },
    { '@type': 'State', name: 'Laguna',      sameAs: 'https://en.wikipedia.org/wiki/Laguna,_Philippines' },
    { '@type': 'State', name: 'Bulacan',     sameAs: 'https://en.wikipedia.org/wiki/Bulacan' },
    { '@type': 'City',  name: 'Metro Manila', sameAs: 'https://en.wikipedia.org/wiki/Metro_Manila' },
  ],
  sameAs: [
    'https://www.facebook.com/profile.php?id=61565408232254',
    'https://www.tiktok.com/@orangesquarerealtycorp',
  ],
  priceRange: '₱890,000+',
  currenciesAccepted: 'PHP',
  paymentAccepted: 'Pag-IBIG Housing Loan, Bank Transfer, Check',
  knowsAbout: [
    'Pag-IBIG Housing Loan',
    'HDMF Loan Processing',
    'Real Estate Philippines',
    'Affordable Housing Philippines',
    'First Time Home Buyer Philippines',
    'OFW Housing Loan',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Real Estate and Pag-IBIG Loan Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Pag-IBIG Loan Processing',
          description:
            'End-to-end Pag-IBIG (HDMF) housing loan processing — from document preparation and filing through to loan release. You never have to line up at a branch.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '24-Hour Free Pre-Qualification',
          description:
            'Free Pag-IBIG eligibility assessment with results within 24 hours. Find out your loanable amount before choosing a property.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Property Matching',
          description:
            'We match buyers to Pag-IBIG-eligible properties across Cavite, Laguna, Bulacan, and Metro Manila from trusted developers including Camella, Lancaster, Lumina, Crown Asia, and more.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'OFW Housing Loan Service',
          description:
            'Remote Pag-IBIG loan processing for Overseas Filipino Workers. Our OFW desk handles everything so you never need to fly back for paperwork.',
        },
      },
    ],
  },
}

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is eligible for a Pag-IBIG housing loan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Any active Pag-IBIG member with at least 24 monthly contributions, not more than 65 years old at loan application, and with the legal capacity to acquire real property. Orange Square Realty assesses your eligibility for free within 24 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much can I borrow with a Pag-IBIG housing loan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pag-IBIG offers up to ₱6 million depending on your actual monthly income, capacity to pay, and the property value. Send us your details and we will compute your exact loanable amount at no charge.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does Orange Square Realty charge for loan processing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We put every fee in writing before you sign anything, and the number never changes after. Pre-qualification costs nothing.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Orange Square Realty handle the entire Pag-IBIG loan application?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We prepare your documents, file them with Pag-IBIG, follow up on your behalf, and stay on it until the loan is released. You never line up at a Pag-IBIG branch.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can OFWs apply for a Pag-IBIG housing loan through OSRC?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Our OFW desk processes everything remotely and updates you at every step, so you never need to fly back to the Philippines to apply for your housing loan.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which areas and developers does Orange Square Realty cover?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We work directly with Camella, Lancaster New City, Lumina, Crown Asia, Futura by Filinvest, Bria Homes, and more across Cavite, Laguna, Bulacan, and Metro Manila.',
      },
    },
  ],
}

const webSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Orange Square Realty Corporation',
  url: SITE_URL,
  description:
    'Find Pag-IBIG eligible properties and get your housing loan processed end-to-end across Cavite, Laguna, Bulacan, and Metro Manila.',
}

function Ld({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

// Site-wide: organization + website. Safe on every public page.
export default function JsonLd() {
  return (
    <>
      <Ld data={localBusiness} />
      <Ld data={webSite} />
    </>
  )
}

// Render only on the page that actually shows the FAQ content (/contact).
export function FaqJsonLd() {
  return <Ld data={faqPage} />
}
