import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Orange Square Realty Corporation collects, uses, and protects your personal information in accordance with the Philippine Data Privacy Act of 2012 (RA 10173).',
  alternates: { canonical: '/privacy-policy' },
  robots: { index: true, follow: false },
  openGraph: {
    title: 'Privacy Policy | Orange Square Realty',
    description: 'How we collect, use, and protect your personal information under the Philippine Data Privacy Act of 2012.',
    url: '/privacy-policy',
  },
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-24">

        <Link href="/" className="inline-flex items-center gap-2 text-[12px] text-[#A89070] hover:text-[#E85D04] transition-colors mb-10">
          ← Back to Home
        </Link>

        <span className="eyebrow mb-5 block">Legal</span>
        <h1 className="font-display text-[clamp(36px,5vw,56px)] text-[#1C1714] mb-3" style={{ lineHeight: 0.95, letterSpacing: '-0.025em' }}>Privacy Policy</h1>
        <p className="text-[#A89070] text-[13px] mb-12">Effective: June 14, 2026 · Last updated: June 14, 2026</p>

        <div className="prose-legal">

          <Section title="1. Who We Are">
            <p>Orange Square Realty Corporation (<strong>"OSRC," "we," "us," or "our"</strong>) is a duly incorporated One Person Corporation registered with the Securities and Exchange Commission of the Philippines (SEC Reg. No. OPC-2024-OSRC-00142), with principal office at Unit 4B, Cityland Herrera Tower, V.A. Rufino St., Salcedo Village, Makati City 1227.</p>
            <p>We are a <strong>Personal Information Controller</strong> as defined under Republic Act No. 10173, otherwise known as the <em>Data Privacy Act of 2012</em>, and its Implementing Rules and Regulations.</p>
          </Section>

          <Section title="2. What Personal Data We Collect">
            <p>When you submit an inquiry through our website, we collect the following:</p>
            <ul>
              <li><strong>Full Name</strong></li>
              <li><strong>Email Address</strong></li>
              <li><strong>Phone Number</strong></li>
              <li>Property of Interest (the property you inquired about)</li>
              <li>Pag-IBIG Membership Status (Active Member / Not Yet a Member)</li>
              <li>Preferred Contact Time</li>
              <li>Any message or notes you voluntarily provide</li>
            </ul>
            <p>We do not collect sensitive personal information such as government ID numbers, financial account details, or biometric data through this website.</p>
          </Section>

          <Section title="3. Why We Collect Your Data">
            <p>We collect and process your personal data for the following purposes:</p>
            <ul>
              <li>To respond to your property inquiry within 24 hours</li>
              <li>To assess your Pag-IBIG housing loan eligibility</li>
              <li>To match you with suitable properties based on your needs</li>
              <li>To assist with Pag-IBIG housing loan application processing if you proceed</li>
              <li>To send you an automated confirmation email acknowledging receipt of your inquiry</li>
              <li>To contact you at your preferred time via phone or email</li>
            </ul>
            <p>The legal basis for processing is your <strong>consent</strong>, given when you voluntarily submit the inquiry form.</p>
          </Section>

          <Section title="4. How We Use and Share Your Data">
            <p>Your personal data is used exclusively by OSRC and its authorized personnel. We do <strong>not</strong> sell, rent, or trade your personal information to third parties.</p>
            <p>We may share your information only in the following limited circumstances:</p>
            <ul>
              <li><strong>Pag-IBIG Fund (HDMF)</strong> — if you proceed with a housing loan application, your data is submitted to Pag-IBIG as required by the loan process.</li>
              <li><strong>Property Developers</strong> — your name and contact details may be shared with the relevant developer (e.g., Camella, Lumina, Lancaster) to process a reservation.</li>
              <li><strong>Service Providers</strong> — we use Resend (an email delivery service) to send inquiry notifications and auto-replies. Resend processes email data on our behalf under a data processing agreement.</li>
              <li><strong>Legal Requirement</strong> — if required by law, court order, or government authority.</li>
            </ul>
          </Section>

          <Section title="5. Data Retention">
            <p>We retain your inquiry data for a maximum of <strong>two (2) years</strong> from the date of submission, or for as long as necessary to fulfill the purpose for which it was collected. If a housing loan transaction proceeds, records may be retained for up to <strong>ten (10) years</strong> in compliance with applicable regulations.</p>
            <p>You may request deletion of your data at any time (see Section 7).</p>
          </Section>

          <Section title="6. Data Security">
            <p>We take reasonable technical and organizational measures to protect your personal data from unauthorized access, disclosure, or destruction, including:</p>
            <ul>
              <li>Encrypted data transmission (HTTPS/TLS) on all web pages</li>
              <li>Access-restricted admin systems protected by Supabase authentication</li>
              <li>Row-level security policies on our database</li>
              <li>No storage of payment or financial credentials</li>
            </ul>
            <p>Despite our efforts, no internet transmission is completely secure. We cannot guarantee absolute security of data transmitted to our website.</p>
          </Section>

          <Section title="7. Your Rights as a Data Subject">
            <p>Under the Data Privacy Act of 2012, you have the right to:</p>
            <ul>
              <li><strong>Be informed</strong> — know what personal data we hold about you</li>
              <li><strong>Access</strong> — request a copy of your personal data</li>
              <li><strong>Correct</strong> — request correction of inaccurate data</li>
              <li><strong>Erasure</strong> — request deletion of your data, subject to legal retention requirements</li>
              <li><strong>Object</strong> — withdraw your consent and object to processing</li>
              <li><strong>File a complaint</strong> — with the National Privacy Commission (NPC) at <em>www.privacy.gov.ph</em></li>
            </ul>
            <p>To exercise any of these rights, contact our Data Privacy Officer at <strong>inquiries@orangesquarerealty.com.ph</strong> or call <strong>+63 951 434 2858</strong>.</p>
          </Section>

          <Section title="8. Cookies">
            <p>Our public website uses minimal cookies. Please see our <Link href="/cookie-policy" className="text-[#E85D04] hover:underline">Cookie Policy</Link> for details.</p>
          </Section>

          <Section title="9. Third-Party Links">
            <p>Our website may link to external sites (e.g., Facebook, developer websites). We are not responsible for the privacy practices of those sites. We encourage you to review their privacy policies before providing any personal information.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. The "Last updated" date at the top of this page reflects the most recent revision. Continued use of the website after changes constitutes acceptance of the updated policy.</p>
          </Section>

          <Section title="11. Contact Us">
            <p>For any privacy-related concerns or requests:</p>
            <address className="not-italic">
              <strong>Orange Square Realty Corporation</strong><br />
              Data Privacy Officer<br />
              Unit 4B, Cityland Herrera Tower<br />
              V.A. Rufino St., Salcedo Village, Makati City 1227<br />
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
