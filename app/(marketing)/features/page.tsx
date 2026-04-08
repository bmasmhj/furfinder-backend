import type { Metadata } from 'next'
import Header from '@/components/marketing/Header'
import Footer from '@/components/marketing/Footer'
import { MarketingSection } from '@/components/marketing/MarketingPrimitives'
import { appFeatureSections, featureCards } from '@/components/marketing/site-content'

export const metadata: Metadata = {
  title: 'Features - The Fur Finder',
  description: 'Explore the feature set behind The Fur Finder lost and found pet platform.',
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a2e]">
      <Header />
      <main>
        <section className="bg-[linear-gradient(180deg,#fff_0%,#fff5f3_100%)] px-6 py-20 text-center md:px-8">
          <span className="inline-flex rounded-full bg-[#eef2ff] px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#6366f1]">
            Feature Overview
          </span>
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-extrabold tracking-[-0.05em] md:text-6xl">
            A complete toolkit for lost and found pet recovery.
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#6b7280]">
            This page condenses the supporting `app-features.html` template into a web-friendly version while preserving the same priorities: reporting speed, AI matching, map search, and rescue collaboration.
          </p>
        </section>

        <MarketingSection eyebrow="Highlights" title="Core product capabilities" description="The same public homepage features are expanded here for people who want a more complete picture." centered>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((feature) => (
              <article key={feature.title} className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${feature.iconClassName}`}>
                  {feature.icon}
                </div>
                <h2 className="text-lg font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm leading-7 text-[#6b7280]">{feature.description}</p>
              </article>
            ))}
          </div>
        </MarketingSection>

        <section className="border-y border-[#f3f4f6] bg-[#fff]">
          <div className="mx-auto max-w-5xl px-6 py-16 md:px-8 md:py-20">
            <div className="space-y-10">
              {appFeatureSections.map((section) => (
                <section key={section.title} className="rounded-3xl border border-[#ececec] bg-[#fff] p-8">
                  <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1a1a2e]">{section.title}</h2>
                  {section.intro ? <p className="mt-4 text-[15px] leading-8 text-[#4a4a6a]">{section.intro}</p> : null}
                  {section.highlight ? (
                    <div
                      className={`mt-5 rounded-r-xl border-l-4 px-5 py-4 text-sm leading-7 ${
                        section.highlight.tone === 'teal'
                          ? 'border-[#2cbcb6] bg-[#e8f8f7] text-[#225b59]'
                          : 'border-[#ff6b4a] bg-[#fff5f3] text-[#6a4b45]'
                      }`}
                    >
                      <strong>{section.highlight.title}:</strong> {section.highlight.body}
                    </div>
                  ) : null}
                  {section.items ? (
                    <div className="mt-6 space-y-5">
                      {section.items.map((item) => (
                        <div key={item.title}>
                          <h3 className="text-base font-semibold text-[#1a1a2e]">{item.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-[#6b7280]">{item.body}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
