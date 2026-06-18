import type { Metadata } from 'next'
import About from '@/components/About'
import Regions from '@/components/Regions'
import Gallery from '@/components/Gallery'
import Team from '@/components/Team'
import Awards from '@/components/Awards'
import Testimonials from '@/components/Testimonials'
import VideoReel from '@/components/VideoReel'
import Insights from '@/components/Insights'
import Marquee from '@/components/Marquee'

export const metadata: Metadata = {
  title: 'About Orange Square Realty — Pag-IBIG Housing Specialists',
  description:
    'Honest Pag-IBIG guidance for Filipino families. Meet the Orange Square Realty team, the areas we serve, client stories, and why first-time home buyers and OFWs trust us.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About | Orange Square Realty',
    description: 'Meet the team, the areas we serve, and why Filipino families trust Orange Square Realty.',
    url: '/about',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'About Orange Square Realty Corporation' }],
  },
}

export default function AboutPage() {
  return (
    <div className="bg-[#FAFAF7] pt-20 sm:pt-24">
      <About />
      <Regions />
      <Gallery />
      <Team />
      <Awards />
      <Testimonials />
      <VideoReel />
      <Insights />
      <Marquee />
    </div>
  )
}
