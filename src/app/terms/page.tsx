import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions governing your use of the Orange Square Realty Corporation website and real estate services.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: false },
  openGraph: {
    title: 'Terms & Conditions | Orange Square Realty',
    description: 'Terms and conditions governing your use of the Orange Square Realty website and services.',
    url: '/terms',
  },
}

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-24">

        <Link href="/" className="inline-flex items-center gap-2 text-[12px] text-[#A89070] hover:text-[#E85D04] transition-colors mb-10">
          ← Back to Home
        </Link>

        <span className="eyebrow mb-5 block">Legal</span>
        <h1 className="font-display text-[clamp(36px,5vw,56px)] text-[#1C1714] mb-3" style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}>Terms & Conditions</h1>
        <p className="text-[#A89070] text-[13px] mb-12">Effective: June 14, 2026 · Last updated: June 14, 2026</p>

        <div className="flex flex-col gap-0">

          <Section title="1. Acceptance of Terms">
            <p>By accessing or using the website at <strong>orangesquarerealty.com.ph</strong> (the "Site"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use this Site.</p>
            <p>These Terms are governed by the laws of the <strong>Republic of the Philippines</strong>, including but not limited to the Electronic Commerce Act (RA 8792), the Data Privacy Act (RA 10173), and the Consumer Act of the Philippines (RA 7394).</p>
          </Section>

          <Section title="2. About OSRC">
            <p>Orange Square Realty Corporation ("OSRC") is a real estate outsourcing company that assists Filipino buyers in finding Pag-IBIG-eligible properties and navigating the Pag-IBIG housing loan application process. OSRC is not a bank, lending institution, or financial advisor.</p>
            <p>OSRC is registered with the Securities and Exchange Commission (SEC Reg. No. OPC-2024-OSRC-00142) and operates in accordance with applicable Philippine laws and regulations.</p>
          </Section>

          <Section title="3. Services Described on This Site">
            <p>The Site provides information about:</p>
            <ul>
              <li>Available Pag-IBIG-eligible residential properties</li>
              <li>Pag-IBIG housing loan processing assistance</li>
              <li>Real estate matching and referral services</li>
              <li>General information about Pag-IBIG Fund (HDMF) loan programs</li>
            </ul>
            <p>Submission of an inquiry form does not constitute a reservation, contract, or guarantee of any service, loan approval, or property availability.</p>
          </Section>

          <Section title="4. No Guarantee of Loan Approval">
            <p>OSRC assists clients with Pag-IBIG housing loan applications but does <strong>not guarantee</strong> loan approval. Loan eligibility, amount, and approval are determined solely by the Home Development Mutual Fund (Pag-IBIG Fund / HDMF) based on the applicant's qualifications and the Fund's prevailing policies. OSRC shall not be liable for any loan rejection or modification by Pag-IBIG Fund.</p>
          </Section>

          <Section title="5. Property Information Accuracy">
            <p>Property listings on this Site — including prices, availability, floor area, lot area, and monthly amortization estimates — are provided for informational purposes only and are subject to change without notice. OSRC makes reasonable efforts to keep listings accurate but does not warrant that all information is complete, current, or error-free.</p>
            <p>Actual property prices, specifications, and availability must be confirmed directly with the property developer. Monthly amortization figures shown are <strong>estimates only</strong> and may vary based on loan amount, term, and prevailing Pag-IBIG interest rates.</p>
          </Section>

          <Section title="6. User Conduct">
            <p>When using this Site or submitting inquiries, you agree not to:</p>
            <ul>
              <li>Provide false, misleading, or fraudulent information</li>
              <li>Submit spam or unsolicited commercial communications</li>
              <li>Attempt to gain unauthorized access to any part of the Site or its systems</li>
              <li>Use the Site for any unlawful purpose</li>
              <li>Reproduce, distribute, or commercially exploit any Site content without prior written consent</li>
            </ul>
          </Section>

          <Section title="7. Intellectual Property">
            <p>All content on this Site — including text, graphics, logos, images, and software — is the property of Orange Square Realty Corporation or its content suppliers and is protected by Philippine intellectual property laws. You may not reproduce, distribute, or create derivative works from any content on this Site without express written permission from OSRC.</p>
            <p>Property photos are provided by the respective property developers and remain their intellectual property.</p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>To the fullest extent permitted by applicable law, OSRC shall not be liable for any indirect, incidental, consequential, or special damages arising out of or in connection with your use of this Site, including but not limited to:</p>
            <ul>
              <li>Reliance on property information or loan estimates published on the Site</li>
              <li>Failure to secure a Pag-IBIG housing loan</li>
              <li>Changes in property prices or availability after submission of an inquiry</li>
              <li>Interruption or unavailability of the Site</li>
            </ul>
            <p>OSRC's total liability for any claim arising from the use of this Site shall not exceed the amount of any service fees actually paid by you to OSRC, if any.</p>
          </Section>

          <Section title="9. Third-Party Links">
            <p>This Site may contain links to third-party websites (e.g., developer websites, Facebook, Pag-IBIG Fund portal). These links are provided for convenience only. OSRC does not endorse and is not responsible for the content, accuracy, or practices of any third-party site.</p>
          </Section>

          <Section title="10. Privacy">
            <p>Your use of this Site is also governed by our <Link href="/privacy-policy" className="text-[#E85D04] hover:underline">Privacy Policy</Link>, which is incorporated into these Terms by reference.</p>
          </Section>

          <Section title="11. Amendments">
            <p>OSRC reserves the right to modify these Terms at any time. Changes take effect upon posting to this page. Continued use of the Site after changes are posted constitutes your acceptance of the revised Terms.</p>
          </Section>

          <Section title="12. Governing Law and Disputes">
            <p>These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines. Any dispute arising out of or in connection with these Terms shall be submitted to the exclusive jurisdiction of the proper courts of <strong>Makati City, Philippines</strong>.</p>
          </Section>

          <Section title="13. Contact">
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
