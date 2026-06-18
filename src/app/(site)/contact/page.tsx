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
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Contact Orange Square Realty — Free Pag-IBIG Pre-Qualification' }],
  },
}

export default function ContactPage() {
  return (
    <div>
      <FaqJsonLd />
      <ContactForm />
      <FAQ />
    </div>
  )
}
