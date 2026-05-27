import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Advertise - The Fur Finder",
  description:
    "Advertising on The Fur Finder is coming soon. Reach pet owners and local communities with trusted placements.",
};

export default function AdvertisePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-orange-50/40 px-6 py-24 text-center dark:to-orange-950/10 md:px-8">
      <div className="mx-auto max-w-3xl">
        <span className="inline-flex rounded-full bg-orange-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-600 dark:text-orange-400">
          Advertise
        </span>
        <h1 className="mt-6 text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-6xl">
          Coming soon
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
          We are preparing advertising options for pet-focused businesses and
          community partners. Stay tuned for launch details.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e5553a]"
          >
            Contact us
          </Link>
          <Link
            href="/"
            className="inline-flex rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
