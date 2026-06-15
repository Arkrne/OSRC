import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import Partners from '@/components/Partners'
import WhyChooseUs from '@/components/WhyChooseUs'
import VideoShowcase from '@/components/VideoShowcase'
import PropertiesPreview from '@/components/PropertiesPreview'
import Promos from '@/components/Promos'
import TrustStats from '@/components/TrustStats'
import FinalCTA from '@/components/FinalCTA'

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
