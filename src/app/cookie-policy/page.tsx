import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Information about how Orange Square Realty Corporation uses cookies and analytics on its website.',
  alternates: { canonical: '/cookie-policy' },
  robots: { index: true, follow: false },
  openGraph: {
    title: 'Cookie Policy | Orange Square Realty',
    description: 'How Orange Square Realty uses cookies and analytics tools on its website.',
    url: '/cookie-policy',
  },
}

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-24">

        <Link href="/" className="inline-flex items-center gap-2 text-[12px] text-[#A89070] hover:text-[#E85D04] transition-colors mb-10">
          ← Back to Home
        </Link>

        <span className="eyebrow mb-5 block">Legal</span>
        <h1 className="font-display text-[clamp(36px,5vw,56px)] text-[#1C1714] mb-3" style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}>Cookie Policy</h1>
        <p className="text-[#A89070] text-[13px] mb-12">Effective: June 14, 2026 · Last updated: June 14, 2026</p>

        <div className="flex flex-col gap-0">

          <Section title="What Are Cookies">
            <p>Cookies are small text files that a website stores on your browser or device when you visit. They are widely used to make websites function, to improve user experience, and to provide information to website owners. Cookies can be "session" cookies (deleted when you close your browser) or "persistent" cookies (stored for a set period).</p>
          </Section>

          <Section title="Cookies We Use">
            <p>The Orange Square Realty Corporation website uses a minimal set of cookies:</p>
            <ul>
              <li>
                <strong>Strictly Necessary — Supabase Session Cookies:</strong> Our admin area (<code className="bg-[rgba(28,23,20,0.06)] px-1 py-0.5 rounded text-[13px]">/admin</code>) uses Supabase authentication, which may set session cookies to maintain a secure admin login. These cookies are <strong>only set for authenticated administrators</strong> and are never placed on browsers of public visitors browsing the main website.
              </li>
              <li>
                <strong>Analytics — Vercel Analytics:</strong> We use Vercel Analytics to understand how visitors use our site (e.g., page views, traffic sources). Vercel Analytics is <strong>cookieless</strong> — it does not set any cookies, does not track individual users, and does not collect personally identifiable information.
              </li>
            </ul>
            <p>We do <strong>not</strong> use advertising cookies, marketing cookies, retargeting pixels, or any third-party tracking cookies (e.g., Google Ads, Facebook Pixel, Hotjar).</p>
          </Section>

          <Section title="No Cookie Consent Banner Needed">
            <p>Because this website does not use marketing, advertising, or non-essential tracking cookies that require prior consent, we do not display a cookie consent banner or pop-up.</p>
            <p>Under Philippine law — including the Data Privacy Act of 2012 (RA 10173) and its implementing rules — a cookie consent mechanism is required only when cookies are used to process personal data beyond what is strictly necessary for the service. Our public site does not meet this threshold.</p>
          </Section>

          <Section title="Third-Party Services">
            <p>We use the following third-party services, which may have their own cookie or data practices:</p>
            <ul>
              <li><strong>Resend</strong> — used for transactional email delivery (inquiry confirmations and admin notifications). Resend may process limited technical data to deliver emails; this is governed by <a href="https://resend.com/privacy" target="_blank" rel="noopener noreferrer">Resend&apos;s Privacy Policy</a>.</li>
              <li><strong>Supabase</strong> — our backend database and authentication provider. Supabase&apos;s data practices are governed by the <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase Privacy Policy</a>.</li>
              <li><strong>Vercel</strong> — our hosting and analytics provider. See the <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel Privacy Policy</a> for details.</li>
            </ul>
          </Section>

          <Section title="Managing Cookies">
            <p>You can control and delete cookies through your browser settings. Most browsers allow you to:</p>
            <ul>
              <li>View what cookies are stored and delete them individually or in bulk</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies from specific sites</li>
              <li>Block all cookies from being set</li>
            </ul>
            <p>Note that blocking all cookies may affect the functionality of the admin area of this site. The public-facing website will continue to function normally without any cookies set.</p>
            <p>For instructions on managing cookies, visit the help documentation for your browser: <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</a>, <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer">Firefox</a>, <a href="https://support.apple.com/en-ph/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a>, or <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Edge</a>.</p>
          </Section>

          <Section title="Contact">
            <p>If you have questions about our use of cookies, please contact us:</p>
            <address className="not-italic">
              <strong>Orange Square Realty Corporation</strong><br />
              #12 Madrona St., Phase 1, Greenwoods Executive Village, Cainta, Rizal 1900<br />
              Email: <a href="mailto:inquiries@orangesquarerealty.com.ph" className="text-[#E85D04] hover:underline">inquiries@orangesquarerealty.com.ph</a><br />
              Phone: +63 956 884 3373
            </address>
          </Section>

        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-[#1C1714] font-semibold text-[17px] mb-4 pb-3 border-b border-[rgba(28,23,20,0.08)]">{title}</h2>
      <div className="flex flex-col gap-3 text-[#4A3D35] text-[14px] leading-relaxed [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:list-disc [&_strong]:text-[#1C1714] [&_a]:text-[#E85D04]">
        {children}
      </div>
    </section>
  )
}
