import JsonLd from '@/components/JsonLd'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Partners from '@/components/Partners'
import Services from '@/components/Services'
import HowItWorks from '@/components/HowItWorks'
import WhyChooseUs from '@/components/WhyChooseUs'
import VideoShowcase from '@/components/VideoShowcase'
import Properties from '@/components/Properties'
import Promos from '@/components/Promos'
import Spotlight from '@/components/Spotlight'
import Gallery from '@/components/Gallery'
import LoanCalculator from '@/components/LoanCalculator'
import Testimonials from '@/components/Testimonials'
import Marquee from '@/components/Marquee'
import VideoReel from '@/components/VideoReel'
import Regions from '@/components/Regions'
import Team from '@/components/Team'
import Awards from '@/components/Awards'
import About from '@/components/About'
import Insights from '@/components/Insights'
import FAQ from '@/components/FAQ'
import TrustStats from '@/components/TrustStats'
import ContactSection from '@/components/ContactForm'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'
import MobileCTABar from '@/components/MobileCTABar'
import ScrollProgress from '@/components/ScrollProgress'

export default function Home() {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main>
        <Hero />
        <Partners />
        <Services />
        <HowItWorks />
        <WhyChooseUs />
        <VideoShowcase />
        <Properties />
        <Promos />
        <Spotlight />
        <Gallery />
        <LoanCalculator />
        <Testimonials />
        <Marquee />
        <VideoReel />
        <Regions />
        <Team />
        <Awards />
        <About />
        <Insights />
        <FAQ />
        <TrustStats />
        <ContactSection />
        <FinalCTA />
      </main>
      <Footer />
      <MobileCTABar />
      <ScrollProgress />
    </>
  )
}
