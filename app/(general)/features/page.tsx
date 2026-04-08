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
    <div className="min-h-screen">
        <section className="section mx-auto max-w-7xl">
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-extrabold tracking-[-0.05em] md:text-6xl">
            A complete toolkit for lost and found pet recovery.
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#6b7280]">
            This page condenses the supporting `app-features.html` template into a web-friendly version while preserving the same priorities: reporting speed, AI matching, map search, and rescue collaboration.
          </p>
        </section>

        <MarketingSection>
          <div className="features-grid">
            {featureCards.map((feature) => (
              <article key={feature.title} className="feature-card">
                <div className={`feature-icon ${feature.iconClassName}`}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </MarketingSection>

        <section className="section mx-auto max-w-7xl">
          <div className=" px-6 py-16 md:px-8 md:py-20">
            <div className="space-y-10">
              {appFeatureSections.map((section) => (
                <section key={section.title} className="feature-card">
                  <h2 className="text-2xl font-bold tracking-[-0.02em] ">{section.title}</h2>
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
    </div>
  )
}
