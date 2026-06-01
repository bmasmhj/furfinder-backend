import type { Metadata } from "next";
import Link from "next/link";
import { partnershipsEmail } from "@/components/marketing/site-content";

export const metadata: Metadata = {
  title: "Manage Ads - The Fur Finder",
  description:
    "The ad management dashboard is coming soon. Soon you'll be able to manage campaigns and performance in one place.",
};

export default function ManageAdsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-blue-50/40 px-6 py-24 text-center dark:to-blue-950/10 md:px-8">
      <div className="mx-auto max-w-3xl">
        <span className="inline-flex rounded-full bg-blue-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
          Manage Ads
        </span>
        <h1 className="mt-6 text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-6xl">
          Coming soon
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
          A dedicated portal for managing ad campaigns, budgets, and reporting
          is currently in development.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          Need campaign details now? Email{" "}
          <a className="font-semibold text-primary hover:underline" href={`mailto:${partnershipsEmail}`}>
            {partnershipsEmail}
          </a>
          .
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
