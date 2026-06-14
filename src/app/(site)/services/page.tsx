import type { Metadata } from 'next'
import Services from '@/components/Services'
import HowItWorks from '@/components/HowItWorks'
import LoanCalculator from '@/components/LoanCalculator'
import Spotlight from '@/components/Spotlight'

export const metadata: Metadata = {
  title: 'Services — Pag-IBIG Loan Processing & Property Matching',
  description:
    'End-to-end Pag-IBIG housing loan processing, free 24-hour pre-qualification, property matching, and OFW housing loan service. See how Orange Square Realty handles everything for you.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services | Orange Square Realty',
    description: 'Pag-IBIG loan processing, pre-qualification, property matching, and OFW housing loan service.',
    url: '/services',
  },
}

export default function ServicesPage() {
  return (
    <div className="bg-[#F5EEE8] pt-20 sm:pt-24">
      <Services />
      <HowItWorks />
      <LoanCalculator />
      <Spotlight />
    </div>
  )
}
