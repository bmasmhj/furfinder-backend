import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Clock, Heart, Share2, PawPrint } from "lucide-react";

// Static data until DB structure is planned
const staticStory = {
  id: "1",
  pet_name: "Buddy",
  pet_type: "Dog",
  breed: "Golden Retriever",
  age: "4 years old",
  color: "Golden",
  location_lost: "Bondi Beach, Sydney NSW",
  location_found: "Coogee, Sydney NSW",
  days_missing: 12,
  reunited_date: "2026-03-18",
  owner_name: "Sarah M.",
  story_content: `Buddy went missing during a walk at Bondi Beach when he slipped his leash chasing a seagull. We searched everywhere — the beach, nearby parks, local streets — but there was no sign of him.

I was devastated. Buddy is more than a pet; he's family. I posted on The Fur Finder within minutes, uploading his photos and marking the exact location on the map. The AI matching feature immediately started scanning found reports in the area.

For 12 long days, we received tips from the community. People shared our report hundreds of times. Local vets and shelters were alerted through the partner network.

Then, on day 12, a family in Coogee — nearly 5km away — posted a found report of a golden retriever they'd been caring for. The Fur Finder's AI flagged it as a 94% match within seconds.

I rushed over, and the moment Buddy saw me, he sprinted across the yard and jumped into my arms. I couldn't stop crying. The family who found him had been feeding him and keeping him safe. They were wonderful people.

Without The Fur Finder, I don't think we would have found Buddy. The AI matching connected us with people we never would have reached on our own. I'm forever grateful.`,
  before_image_url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop",
  after_image_url: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=800&h=600&fit=crop",
  gallery_images: [
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1583337130417-13571fc8abf2?w=600&h=400&fit=crop",
  ],
  tags: ["Dog", "Golden Retriever", "Sydney", "AI Match"],
  match_confidence: 94,
  featured_on_homepage: true,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  // In future, fetch from DB using params.id
  return {
    title: `${staticStory.pet_name}'s Reunion Story - The Fur Finder`,
    description: `Read how ${staticStory.pet_name} the ${staticStory.breed} was reunited with their family after ${staticStory.days_missing} days missing.`,
  };
}

export default async function ReunitedStoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // TODO: Fetch from DB using id
  const story = staticStory;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        {/* Hero with before/after images */}
        <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-background dark:from-orange-950/20 dark:to-background">
          <div className="mx-auto max-w-6xl px-6 pb-12 pt-8">
            {/* Back link */}
            <Link
              href="/reunited-stories"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft size={16} />
              Back to Stories
            </Link>

            {/* Status badge */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Heart size={12} className="fill-current" />
                Reunited
              </span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {story.pet_type}
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                {story.breed}
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-extrabold tracking-[-0.03em] text-foreground md:text-5xl">
              {story.pet_name}&apos;s Journey Home
            </h1>

            {/* Meta info */}
            <div className="mb-10 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                Reunited{" "}
                {new Date(story.reunited_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {story.days_missing} days missing
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {story.location_lost}
              </span>
            </div>

            {/* Before / After images */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="group relative overflow-hidden rounded-2xl border border-border shadow-sm">
                <div className="absolute left-4 top-4 z-10 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  When Missing
                </div>
                <img
                  src={story.before_image_url}
                  alt={`${story.pet_name} - missing`}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="group relative overflow-hidden rounded-2xl border-2 border-emerald-300 shadow-sm dark:border-emerald-700">
                <div className="absolute left-4 top-4 z-10 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                  💚 Reunited!
                </div>
                <img
                  src={story.after_image_url}
                  alt={`${story.pet_name} - reunited`}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Story content + sidebar */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            {/* Main story */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                The Full Story
              </h2>
              <div className="space-y-5 text-[15px] leading-8 text-foreground/80">
                {story.story_content.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* AI Match highlight */}
              <div className="mt-10 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-teal-500/5 p-6 dark:from-primary/10 dark:to-teal-500/10">
                <div className="mb-3 flex items-center gap-2">
                  <PawPrint size={20} className="text-primary" />
                  <h3 className="text-lg font-bold text-foreground">AI Match Result</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  The Fur Finder&apos;s AI identified {story.pet_name} as a{" "}
                  <span className="font-bold text-primary">
                    {story.match_confidence}% match
                  </span>{" "}
                  from a found report posted {story.days_missing} days after going missing,
                  approximately 5km from the original location.
                </p>
              </div>

              {/* Photo gallery */}
              {story.gallery_images.length > 0 && (
                <div className="mt-12">
                  <h3 className="mb-5 text-xl font-bold text-foreground">
                    More Photos of {story.pet_name}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {story.gallery_images.map((img, i) => (
                      <div
                        key={i}
                        className="group overflow-hidden rounded-xl border border-border"
                      >
                        <img
                          src={img}
                          alt={`${story.pet_name} photo ${i + 1}`}
                          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Quick facts card */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="mb-4 text-base font-bold text-foreground">
                  Quick Facts
                </h3>
                <dl className="space-y-3.5 text-sm">
                  {[
                    { label: "Pet Name", value: story.pet_name },
                    { label: "Type", value: story.pet_type },
                    { label: "Breed", value: story.breed },
                    { label: "Age", value: story.age },
                    { label: "Color", value: story.color },
                    { label: "Lost Near", value: story.location_lost },
                    { label: "Found Near", value: story.location_found },
                    { label: "Days Missing", value: `${story.days_missing} days` },
                    { label: "Owner", value: story.owner_name },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">{item.label}</dt>
                      <dd className="font-medium text-foreground text-right">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Tags */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="mb-3 text-base font-bold text-foreground">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share / CTA */}
              <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-orange-50 to-background p-6 dark:from-orange-950/20">
                <h3 className="mb-2 text-base font-bold text-foreground">
                  Lost your pet?
                </h3>
                <p className="mb-5 text-sm text-muted-foreground">
                  Post a free report and let our AI scan for matches across Australia.
                </p>
                <Link
                  href="/download"
                  className="block w-full rounded-xl bg-primary py-3 text-center text-sm font-semibold text-white transition hover:bg-[#e5553a]"
                >
                  Download The Fur Finder
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-border bg-muted/50 px-6 py-12 text-center">
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Every reunion starts with a single report. Join thousands of Australians
            using The Fur Finder to bring pets home.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link
              href="/reunited-stories"
              className="inline-flex items-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              More Stories
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e5553a]"
            >
              How It Works
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
