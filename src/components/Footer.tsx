import { Mail, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const quickLinks = [
  { href: '/',           label: 'Home'       },
  { href: '/properties', label: 'Properties' },
  { href: '/services',   label: 'Services'   },
  { href: '/about',      label: 'About'      },
]

const services = [
  'Pag-IBIG Loan Processing',
  'Real Estate Outsourcing',
  'Property Matching',
  '24-hr Pre-Qualification',
]

export default function Footer() {
  return (
    <footer className="bg-[#0B0906] border-t border-[rgba(255,255,255,0.08)]">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-20 pt-14 sm:pt-16 pb-[calc(max(2.5rem,env(safe-area-inset-bottom))+76px)] md:pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 sm:gap-12 mb-14 sm:mb-16">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-5">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-[0_0_14px_rgba(232,93,4,0.3)] shrink-0">
                <Image src="/logo.jpg" alt="OSRC Logo" fill className="object-contain" sizes="32px" />
              </div>
              <div>
                <div className="font-semibold text-[#FBF6EC] text-[13px] leading-tight tracking-tight">Orange Square</div>
                <div className="text-[10px] text-[#8A7C68] tracking-wider uppercase">Realty Corporation</div>
              </div>
            </div>
            <p className="text-[#C6B9A4] text-[13px] leading-relaxed max-w-[220px]">
              Honest Pag-IBIG guidance for Filipino families buying their first home.
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.facebook.com/profile.php?id=61565408232254"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.09)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.95] hover:-translate-y-0.5"
                aria-label="Orange Square Realty on Facebook"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#C6B9A4]">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@orangesquarerealtycorp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.09)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center transition-[background-color,transform] duration-[160ms] ease-out active:scale-[0.95] hover:-translate-y-0.5"
                aria-label="Orange Square Realty on TikTok"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-[#C6B9A4]">
                  <path d="M12.53 2h2.95c.16 1.2.66 2.32 1.43 3.22A5 5 0 0 0 20 6.7v2.97a7.9 7.9 0 0 1-4.2-1.25v5.93A5.59 5.59 0 1 1 10.2 8.78c.3 0 .6.02.88.07v3.02a2.6 2.6 0 1 0 1.45 2.34V2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-semibold text-[#8A7C68] uppercase tracking-[0.15em] mb-4 sm:mb-5">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-1">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex py-1.5 text-[13px] text-[#C6B9A4] hover:text-[#FBF6EC] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[10px] font-semibold text-[#8A7C68] uppercase tracking-[0.15em] mb-4 sm:mb-5">
              Services
            </h4>
            <ul className="flex flex-col gap-2.5">
              {services.map(s => (
                <li key={s} className="text-[13px] text-[#C6B9A4]">{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-[10px] font-semibold text-[#8A7C68] uppercase tracking-[0.15em] mb-4 sm:mb-5">
              Contact
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="tel:+639568843373" className="flex items-start gap-2.5 py-0.5 text-[13px] text-[#C6B9A4] hover:text-[#FBF6EC] transition-colors group">
                  <Phone size={14} strokeWidth={1.75} className="mt-0.5 shrink-0 group-hover:text-[#F27024] transition-colors" />
                  +63 956 884 3373
                </a>
              </li>
              <li>
                <a href="mailto:inquiries@orangesquarerealty.com.ph" className="flex items-start gap-2.5 py-0.5 text-[13px] text-[#C6B9A4] hover:text-[#FBF6EC] transition-colors group break-all">
                  <Mail size={14} strokeWidth={1.75} className="mt-0.5 shrink-0 group-hover:text-[#F27024] transition-colors" />
                  inquiries@orangesquarerealty.com.ph
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-[13px] text-[#C6B9A4]">
                  <MapPin size={14} strokeWidth={1.75} className="mt-0.5 shrink-0" />
                  #12 Madrona St., Phase 1,<br />Greenwoods Exec. Village,<br />Cainta, Rizal 1900
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[rgba(255,255,255,0.07)] pt-7 sm:pt-8 flex flex-col gap-4">
          {/* Legal links row */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-2">
            {[
              { href: '/privacy-policy', label: 'Privacy Policy' },
              { href: '/terms', label: 'Terms & Conditions' },
              { href: '/disclaimer', label: 'Disclaimer' },
              { href: '/cookie-policy', label: 'Cookie Policy' },
            ].map(link => (
              <a key={link.href} href={link.href} className="text-[11px] text-[#8A7C68] hover:text-[#C6B9A4] transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          {/* Copyright + credit row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-[11px] text-[#8A7C68]">
              © {new Date().getFullYear()} Orange Square Realty Corporation. All rights reserved.
            </p>
            <p className="text-[11px] text-[#8A7C68]">
              SEC Reg. No. OPC-2024-OSRC-00142 · Built by{' '}
              <a href="https://francissaldua.me" target="_blank" rel="noopener noreferrer" className="text-[#C6B9A4] hover:text-[#F27024] transition-colors">
                ARKRNE Web Designs
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
