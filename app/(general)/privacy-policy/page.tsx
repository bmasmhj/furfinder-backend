import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPageLayout, LegalSection } from '@/components/marketing/MarketingPrimitives'
import { privacySections, supportEmail } from '@/components/marketing/site-content'

export const metadata: Metadata = {
  title: 'Privacy Policy - The Fur Finder',
  description: 'Privacy policy for The Fur Finder.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a2e]">
      <main>
        <div className="border-b border-[#e5e7eb] bg-[linear-gradient(180deg,#fff_0%,#fff5f3_100%)]">
          <LegalPageLayout
            title="The Fur Finder Privacy Policy"
            subtitle="Your privacy matters to us"
            meta="Last updated: February 2026 | Version 1.0"
          >
            <div className="inline-flex items-center gap-2 rounded-xl border border-[#ff6b4a] bg-[#fff5f3] px-4 py-2 text-sm font-semibold text-[#ff6b4a]">
              Data Protection Compliant
            </div>
            <p className="text-[15px] leading-8 text-[#4a4a6a]">
              The Fur Finder is committed to protecting personal information and your privacy. We comply with all applicable privacy laws and regulations. Your trust is essential to our mission.
            </p>
            {privacySections.map((section) => (
              <LegalSection key={section.title} title={section.title} body={section.body} />
            ))}
            <LegalSection
              title="6. Contact Us"
              body={`If you have questions about this policy or want to exercise your privacy rights, contact us at:\n\nEmail: ${supportEmail}`}
            />
          </LegalPageLayout>
        </div>

        <section className="mx-auto max-w-4xl px-6 py-12 md:px-8">
          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-8">
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Questions about Privacy?</h3>
            <p className="text-[#6b7280] mb-4">
              If you have any concerns about your personal information or our privacy practices, we&apos;re here to help.
            </p>
            <a
              href={`mailto:${supportEmail}?subject=Privacy%20Inquiry`}
              className="inline-flex rounded-lg bg-[#ff6b4a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e55a3a]"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
