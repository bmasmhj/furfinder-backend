import type { Metadata } from 'next'
import { MarketingSection } from '@/components/marketing/MarketingPrimitives'
import { appFeatureSections } from '@/components/marketing/site-content'

export const metadata: Metadata = {
  title: 'Full Feature List - The Fur Finder',
  description: 'A complete product overview based on the original app-features template.',
}

export default function AppFeaturesPage() {
  return (
    <div className="bg-background">
      <main className="mx-auto max-w-5xl px-6 py-16 md:px-8">
        <div className="border-b-4 border-primary pb-8 text-center">
          <h1 className="text-4xl font-bold tracking-[-0.03em] text-primary">The Fur Finder</h1>
          <p className="mt-2 text-lg text-muted-foreground">Lost &amp; Found Pets — Complete Feature Overview</p>
          <p className="mt-2 text-sm text-muted-foreground/60">Australia&apos;s AI-Powered Pet Recovery Platform | iOS &amp; Android</p>
        </div>

        <div className="space-y-8 pt-10">
          {appFeatureSections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-border bg-card p-8">
              <h2 className="text-2xl font-semibold text-teal-600 dark:text-teal-400">{section.title}</h2>
              {section.intro ? <p className="mt-4 text-sm leading-8 text-muted-foreground">{section.intro}</p> : null}
              {section.highlight ? (
                <div
                  className={`mt-5 rounded-r-xl border-l-4 px-5 py-4 text-sm ${
                    section.highlight.tone === 'teal'
                      ? 'border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-950/20 dark:text-teal-300'
                      : 'border-primary bg-primary/10 text-orange-800 dark:text-orange-300'
                  }`}
                >
                  <strong>{section.highlight.title}:</strong> {section.highlight.body}
                </div>
              ) : null}
              {section.items ? (
                <div className="mt-6 space-y-4">
                  {section.items.map((item) => (
                    <div key={item.title}>
                      <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
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
            className="inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e55a3a]"
          >
            Back to homepage
          </a>
        </MarketingSection>
      </main>
    </div>
  )
}
