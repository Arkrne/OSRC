import type { Metadata, Viewport } from 'next'
import { DM_Serif_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const dmSerif = DM_Serif_Display({
  variable: '--font-dm-serif',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://orangesquarerealty.com.ph'),
  title: {
    default: 'Orange Square Realty Corporation — Pag-IBIG Housing Loan Specialists',
    template: '%s | Orange Square Realty',
  },
  description:
    'Find your dream home with trusted Pag-IBIG housing loan processing. Orange Square Realty Corporation connects Filipino families with Pag-IBIG-eligible properties across Cavite, Laguna, Bulacan, and Metro Manila. Free pre-qualification in 24 hours.',
  keywords: [
    'Pag-IBIG housing loan',
    'Pag-IBIG loan processing Philippines',
    'HDMF housing loan',
    'affordable house and lot Philippines',
    'house and lot Cavite',
    'house and lot Laguna',
    'house and lot Bulacan',
    'house and lot Metro Manila',
    'real estate agent Philippines',
    'Pag-IBIG loan specialist',
    'first time home buyer Philippines',
    'housing loan processing Philippines',
    'Pag-IBIG eligible properties',
    'affordable housing Philippines',
    'OFW housing loan Philippines',
    'Pag-IBIG pre-qualification',
    'Camella Homes Cavite',
    'Lancaster New City',
    'Lumina Homes',
    'Crown Asia properties',
  ],
  authors: [{ name: 'Orange Square Realty Corporation', url: 'https://orangesquarerealty.com.ph' }],
  creator: 'Orange Square Realty Corporation',
  publisher: 'Orange Square Realty Corporation',
  category: 'Real Estate',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Orange Square Realty Corporation — Pag-IBIG Housing Loan Specialists',
    description: 'Find Your Dream Home. We Handle the Pag-IBIG Loan. Free pre-qualification in 24 hours across Cavite, Laguna, Bulacan & Metro Manila.',
    type: 'website',
    locale: 'en_PH',
    siteName: 'Orange Square Realty Corporation',
    url: 'https://orangesquarerealty.com.ph',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Orange Square Realty Corporation — Pag-IBIG Housing Loan Specialists Philippines' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orange Square Realty Corporation — Pag-IBIG Housing Loan Specialists',
    description: 'Find Your Dream Home. We Handle the Pag-IBIG Loan. Free pre-qualification in 24 hours.',
    site: '@orangesquarerealty',
    images: ['/opengraph-image'],
  },
  icons: {
    icon: [{ url: '/favicon.ico' }],
    apple: [{ url: '/logo.jpg', sizes: '180x180', type: 'image/jpeg' }],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // enables env(safe-area-inset-*) on notch / Dynamic Island devices
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAF7' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0906' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PH" className={`${dmSerif.variable} ${jakarta.variable}`}>
      <body className="grain antialiased overflow-x-hidden min-h-svh" style={{ backgroundColor: '#FAFAF7', color: '#1C1714' }}>
        {children}
      </body>
    </html>
  )
}
