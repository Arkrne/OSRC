import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Important disclaimers regarding property listings, Pag-IBIG loan estimates, and real estate services offered by Orange Square Realty Corporation.',
  alternates: { canonical: '/disclaimer' },
  robots: { index: true, follow: false },
  openGraph: {
    title: 'Disclaimer | Orange Square Realty',
    description: 'Important disclaimers regarding property listings, loan estimates, and services offered by Orange Square Realty.',
    url: '/disclaimer',
  },
}

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-24">

        <Link href="/" className="inline-flex items-center gap-2 text-[12px] text-[#A89070] hover:text-[#E85D04] transition-colors mb-10">
          ← Back to Home
        </Link>

        <span className="eyebrow mb-5 block">Legal</span>
        <h1 className="font-display text-[clamp(36px,5vw,56px)] text-[#1C1714] mb-3" style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}>Disclaimer</h1>
        <p className="text-[#A89070] text-[13px] mb-12">Effective: June 14, 2026 · Last updated: June 14, 2026</p>

        <div className="flex flex-col gap-0">

          <Section title="Property Prices & Availability">
            <p>All prices shown on this website are indicative and subject to change without notice. Property availability must be confirmed directly with the developer prior to making any reservation or commitment. Orange Square Realty Corporation (OSRC) cannot guarantee that any listed property remains available at the time of your inquiry.</p>
          </Section>

          <Section title="Monthly Amortization Estimates">
            <p>Monthly amortization figures shown on this site (e.g., "₱12,800/month") are <strong>estimates only</strong>, calculated based on a 25-year Pag-IBIG housing loan at prevailing interest rates at the time of publication. Actual monthly amortization amounts will depend on the approved loan amount, chosen loan term, and the interest rate in effect at the time of loan release by Pag-IBIG Fund (HDMF).</p>
            <p>These figures are provided for general reference and should not be relied upon as a precise financial commitment.</p>
          </Section>

          <Section title="No Guarantee of Loan Approval">
            <p>OSRC assists clients with the Pag-IBIG housing loan application process but does <strong>not guarantee</strong> loan approval. All loan approvals are at the sole discretion of the Home Development Mutual Fund (Pag-IBIG Fund / HDMF) and are subject to the Fund's eligibility requirements, credit evaluation processes, and prevailing policies at the time of application.</p>
            <p>OSRC shall not be held liable for any loan rejection, modification of loan terms, or any financial loss resulting from a denied Pag-IBIG loan application.</p>
          </Section>

          <Section title="Not a Financial Advisor">
            <p>Information published on this website is general in nature and is intended for informational purposes only. Nothing on this site constitutes financial, legal, tax, or investment advice. OSRC is not a licensed financial advisor, bank, or lending institution.</p>
            <p>We strongly recommend that you consult a licensed real estate broker, financial advisor, or legal professional before making any property purchase or investment decision.</p>
          </Section>

          <Section title="Developer Information">
            <p>Property details — including floor area, lot area, unit count, amenities, and completion timelines — are sourced from the respective property developers and are reproduced in good faith. OSRC is not responsible for any inaccuracies, omissions, or changes in developer-provided information. All such details must be verified directly with the developer before making a purchase decision.</p>
          </Section>

          <Section title="Images">
            <p>Property photos, renders, and illustrations shown on this website are for <strong>illustrative purposes only</strong>. Actual units, common areas, and surroundings may differ in finishes, layout, furnishings, landscaping, and overall appearance from what is depicted. Images may include computer-generated renders or showroom photos that do not represent the actual delivered condition of the property.</p>
          </Section>

          <Section title="Contact">
            <address className="not-italic">
              <strong>Orange Square Realty Corporation</strong><br />
              Unit 4B, Cityland Herrera Tower, V.A. Rufino St., Salcedo Village, Makati City 1227<br />
              Email: <a href="mailto:inquiries@orangesquarerealty.com.ph" className="text-[#E85D04] hover:underline">inquiries@orangesquarerealty.com.ph</a><br />
              Phone: +63 951 434 2858
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
