import type { Metadata } from "next";
import Link from "next/link";
import PartnerInterestFunnel from "@/components/marketing/PartnerInterestFunnel";

export const metadata: Metadata = {
  title: "Partner With The Fur Finder - Partner Intake",
  description:
    "Start the partner intake for veterinary clinics, shelters, rescues, and community organisations that want to join The Fur Finder network.",
};

export default function PartnerRegistrationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-teal-50/40 to-orange-50/30 py-20 dark:via-teal-950/10 dark:to-orange-950/10">
      <section className="px-6 text-center md:px-8">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex rounded-full bg-teal-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-600 dark:text-teal-400">
            Partner With Us
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-6xl">
            Join The Fur Finder partner network
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
            Help reunite more pets by connecting your team to Australia&apos;s AI-powered lost and found workflow. This intake is designed for veterinary clinics, shelters, rescue organisations, and councils.
          </p>
        </div>
      </section>

      <div className="mt-12">
        <PartnerInterestFunnel />
      </div>

      <section className="px-6 pb-16 text-center md:px-8">
        <p className="text-sm text-muted-foreground">
          Looking for advertising instead? Visit{" "}
          <Link href="/advertise" className="font-semibold text-primary hover:underline">
            advertise options
          </Link>{" "}
          or contact the team directly.
        </p>
      </section>
    </main>
  );
}
