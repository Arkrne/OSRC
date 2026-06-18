import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import Partners from '@/components/Partners'
import WhyChooseUs from '@/components/WhyChooseUs'
import VideoShowcase from '@/components/VideoShowcase'
import PropertiesPreview from '@/components/PropertiesPreview'
import Promos from '@/components/Promos'
import TrustStats from '@/components/TrustStats'
import FinalCTA from '@/components/FinalCTA'

export const metadata: Metadata = {
  title: 'Orange Square Realty Corporation — Pag-IBIG Housing Loan Specialists',
  description:
    'Find your dream home with trusted Pag-IBIG housing loan processing. Orange Square Realty Corporation connects Filipino families with Pag-IBIG-eligible properties across Cavite, Laguna, Bulacan, and Metro Manila. Free pre-qualification in 24 hours.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Orange Square Realty Corporation — Pag-IBIG Housing Loan Specialists',
    description:
      'Find Your Dream Home. We Handle the Pag-IBIG Loan. Free pre-qualification in 24 hours across Cavite, Laguna, Bulacan & Metro Manila.',
    url: '/',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Orange Square Realty Corporation — Pag-IBIG Housing Loan Specialists Philippines' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orange Square Realty Corporation — Pag-IBIG Housing Loan Specialists',
    description: 'Find Your Dream Home. We Handle the Pag-IBIG Loan. Free pre-qualification in 24 hours.',
    images: ['/opengraph-image'],
  },
}

// Always render fresh so newly-added listings appear immediately.
export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Partners />
      <WhyChooseUs />
      <VideoShowcase />
      <PropertiesPreview />
      <Promos />
      <TrustStats />
      <FinalCTA />
    </>
  )
}
