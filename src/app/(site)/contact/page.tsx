import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import FAQ from '@/components/FAQ'
import { FaqJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Contact — Free Pag-IBIG Pre-Qualification',
  description:
    'Get in touch with Orange Square Realty for free 24-hour Pag-IBIG pre-qualification. Call, email, or send an inquiry — plus answers to the most common Pag-IBIG housing loan questions.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | Orange Square Realty',
    description: 'Free 24-hour Pag-IBIG pre-qualification. Call, email, or send an inquiry.',
    url: '/contact',
  },
}

export default function ContactPage() {
  return (
    <div className="bg-[#0B0906] pt-20 sm:pt-24">
      <FaqJsonLd />
      <ContactForm />
      <FAQ />
    </div>
  )
}
