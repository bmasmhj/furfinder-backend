import type { Metadata } from 'next'
import { MarketingSection } from '@/components/marketing/MarketingPrimitives'
import { founderStory } from '@/components/marketing/site-content'

export const metadata: Metadata = {
  title: 'Our Story - The Fur Finder',
  description: 'Learn why The Fur Finder was built and the mission behind the product.',
}

const values = [
  {
    icon: '❤️',
    title: 'Compassion',
    body: 'We understand the panic and grief of a missing pet, so every product decision is made to reduce friction in that moment.',
  },
  {
    icon: '🔬',
    title: 'Innovation',
    body: 'We use practical AI where it genuinely helps, especially in narrowing down possible matches faster than manual searching.',
  },
  {
    icon: '🤝',
    title: 'Community',
    body: 'Lost pet recovery works best when owners, neighbours, shelters, and vets are connected through one clear system.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <section className="bg-gradient-to-b from-background to-orange-50/50 px-6 py-20 text-center dark:to-orange-950/10 md:px-8">
          <span className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Our Story
          </span>
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-6xl">
            Built from one very personal search for home.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            The Fur Finder exists because losing a pet is chaotic, emotional, and often scattered across too many tools. We wanted one place that could help families act fast.
          </p>
        </section>

        <MarketingSection
          eyebrow="Founder"
          title="Why this platform had to exist"
          description="The original landing page story is now part of the product story itself, because it is the clearest explanation of why the work matters."
        >
          <div className="rounded-[28px] border border-orange-200 bg-gradient-to-br from-orange-50 to-teal-50 px-8 py-10 dark:border-orange-900/30 dark:from-orange-950/20 dark:to-teal-950/20 md:px-10">
            <div className="space-y-5 text-[15px] leading-8 text-foreground/80">
              {founderStory.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </MarketingSection>

        <section className="border-y border-border bg-muted/50">
          <MarketingSection
            eyebrow="Values"
            eyebrowTone="teal"
            title="What guides the product"
            description="The Fur Finder blends technology with trust, care, and local action."
            centered
          >
            <div className="grid gap-6 md:grid-cols-3">
              {values.map((value) => (
                <article key={value.title} className="rounded-3xl border border-border bg-card p-8">
                  <div className="text-4xl">{value.icon}</div>
                  <h2 className="mt-4 text-xl font-bold text-foreground">{value.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{value.body}</p>
                </article>
              ))}
            </div>
          </MarketingSection>
        </section>
      </main>
    </div>
  )
}
