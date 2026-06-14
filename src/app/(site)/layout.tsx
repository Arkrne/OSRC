import type { ReactNode } from 'react'
import JsonLd from '@/components/JsonLd'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import MobileCTABar from '@/components/MobileCTABar'
import ScrollProgress from '@/components/ScrollProgress'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <MobileCTABar />
      <ScrollProgress />
    </>
  )
}
