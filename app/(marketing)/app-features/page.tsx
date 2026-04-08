import type { Metadata } from 'next'
import Header from '@/components/marketing/Header'
import Footer from '@/components/marketing/Footer'
import { MarketingSection } from '@/components/marketing/MarketingPrimitives'
import { appFeatureSections } from '@/components/marketing/site-content'

export const metadata: Metadata = {
  title: 'Full Feature List - The Fur Finder',
  description: 'A complete product overview based on the original app-features template.',
}

export default function AppFeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-[#2d3436]">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-16 md:px-8">
        <div className="border-b-4 border-[#ff6b4a] pb-8 text-center">
          <h1 className="text-4xl font-bold tracking-[-0.03em] text-[#ff6b4a]">The Fur Finder</h1>
          <p className="mt-2 text-lg text-[#636e72]">Lost &amp; Found Pets — Complete Feature Overview</p>
          <p className="mt-2 text-sm text-[#999]">Australia&apos;s AI-Powered Pet Recovery Platform | iOS &amp; Android</p>
        </div>

        <div className="space-y-8 pt-10">
          {appFeatureSections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-[#eee] bg-white p-8">
              <h2 className="text-2xl font-semibold text-[#2cbcb6]">{section.title}</h2>
              {section.intro ? <p className="mt-4 text-sm leading-8 text-[#4a4a6a]">{section.intro}</p> : null}
              {section.highlight ? (
                <div
                  className={`mt-5 rounded-r-xl border-l-4 px-5 py-4 text-sm ${
                    section.highlight.tone === 'teal'
                      ? 'border-[#2cbcb6] bg-[#e8f8f7] text-[#225b59]'
                      : 'border-[#ff6b4a] bg-[#fff5f3] text-[#6a4b45]'
                  }`}
                >
                  <strong>{section.highlight.title}:</strong> {section.highlight.body}
                </div>
              ) : null}
              {section.items ? (
                <div className="mt-6 space-y-4">
                  {section.items.map((item) => (
                    <div key={item.title}>
                      <h3 className="text-base font-semibold text-[#2d3436]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[#4a4a6a]">{item.body}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>

        <MarketingSection
          className="px-0 pb-0"
          title="Need the short version?"
          description="The homepage keeps the same core ideas in a faster, public-facing format."
        >
          <a
            href="/"
            className="inline-flex rounded-xl bg-[#ff6b4a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e55a3a]"
          >
            Back to homepage
          </a>
        </MarketingSection>
      </main>
      <Footer />
    </div>
  )
}
