import type { Metadata } from "next";
import { MarketingSection } from "@/components/marketing/MarketingPrimitives";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Features - The Fur Finder",
  description:
    "Explore the feature set behind The Fur Finder lost and found pet platform.",
};

async function getFeatures() {
  try {
    const features = await db.queryMany(
      'SELECT *, icon_name AS icon FROM features WHERE is_active = true ORDER BY display_order ASC'
    );
    return features || [];
  } catch (error) {
    console.error("Error fetching features:", error);
    return [];
  }
}

export default async function FeaturesPage() {
  const features = await getFeatures();

  return (
    <div className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-6xl">
          A complete toolkit for lost and found pet recovery.
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
          Every feature is designed with one goal in mind: reuniting lost pets
          with their families faster.
        </p>
      </section>

      <MarketingSection>
        {features.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature: any) => (
              <article
                key={feature.id}
                className="rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg"
              >
                {feature.icon && (
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-[22px]">
                    {feature.icon}
                  </div>
                )}
                <h3 className="mb-1.5 text-[15px] font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No features available at the moment.
          </p>
        )}
      </MarketingSection>
    </div>
  );
}
