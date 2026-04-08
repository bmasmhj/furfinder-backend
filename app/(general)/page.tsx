import type { Metadata } from "next";
import Link from "next/link";
import styles from "./landing-page.module.css";
import Header from "@/components/marketing/Header";
import HeroSection from "@/components/marketing/Hero";
import WhoisitFor from "@/components/marketing/WhoIsItFor";

export const metadata: Metadata = {
  title: "The Fur Finder — Australia's AI-Powered Lost & Found Pets App",
  description:
    "Report lost or found pets, get instant AI photo matching, and connect with your community to bring pets home. Available on iOS and Android.",
};

const appStoreUrl = "https://apps.apple.com/app/id6759967208";
const playStoreUrl =
  "https://play.google.com/store/apps/details?id=com.petreunite.app";

const faqItems = [
  [
    "Is The Fur Finder free to use?",
    "Yes — downloading the app and posting lost or found reports is completely free, no credit card required. Premium ($4.99/month) unlocks AI photo matching, post scanning, and biometric identification for those who want the full toolkit.",
  ],
  [
    "How does the AI photo matching work?",
    "When you upload a photo of your pet, our AI analyses it for visual characteristics — coat colour and patterns, facial features, markings, and body shape. It then compares these against every found pet report within your search radius and returns a ranked list of potential matches with a confidence percentage and written explanation.",
  ],
  [
    "I've found a stray — what should I do?",
    'Open the app, tap "Report Found Pet", take a few photos, and drop a pin on the map where you found them. Our AI will immediately check it against all active lost reports in the area. You can also use the Quick Snap feature to photograph the pet and run a biometric scan to see if their owner has registered them. In the meantime, check if the pet is microchipped at your nearest vet — it\'s free.',
  ],
  [
    "My pet is lost right now — what do I do first?",
    "Stay calm, then: 1) Post a lost report in the app immediately with the best photos you have. 2) Share the report to your local Facebook and community groups. 3) Contact nearby vets and shelters — the app's directory makes this easy. 4) Use the app's printable flyer feature to create posters you can put up in the area. 5) Enable area alerts so you're notified if someone finds a pet matching your description nearby.",
  ],
  [
    "What types of pets are supported?",
    "Dogs, cats, birds, rabbits, reptiles, small animals (guinea pigs, hamsters, ferrets), and any other pet. When creating a report, simply select the pet type from the list — the AI matching adapts its analysis accordingly.",
  ],
  [
    "Is my personal information kept private?",
    "Yes. Your phone number is optional and hidden from public view by default — you choose whether to show it. All messages between users happen inside the app so neither party needs to share personal contact details. We do not sell your data to third parties. You can read our full Privacy Policy for details.",
  ],
  [
    "I found my pet — how do I close my report?",
    'Open your report, tap the "Mark as Reunited" button, and optionally share a short reunion message. Your report will move to the Happy Tails section, celebrating your reunion and giving hope to others. The report is no longer shown as active in the search.',
  ],
  [
    "Can vets, shelters, and rescues use the app?",
    "Absolutely — and it's free. Organisations can register as a partner, list animals currently in their care, and have those animals automatically included in AI matching results. When a lost pet's owner runs a match, your shelter's animals appear in the results if they're a match. Register through the app under Settings → Register as Partner.",
  ],
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      <HeroSection />
      <div className="mission-band">
        <p>
          <strong>Every minute counts.</strong> We built The Fur Finder because
          too many lost pets never make it home — not for lack of love, but for
          lack of the right tools. We're changing that.
        </p>
      </div>

      <WhoisitFor />

      <section className={styles.ctaSection} id="download">
        <h2>Download The Fur Finder — Free</h2>
        <p>
          Every pet deserves the best chance of getting home. Join thousands of
          Australians already using The Fur Finder to report, search, and
          reunite.
        </p>
        <div className={styles.storeBadges}>
          <a
            href={appStoreUrl}
            className={styles.storeBadge}
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className={styles.storeMeta}>
              <span className={styles.storeSmall}>Download on the</span>
              <span className={styles.storeName}>App Store</span>
            </div>
          </a>
          <a
            href={playStoreUrl}
            className={styles.storeBadge}
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            <div className={styles.storeMeta}>
              <span className={styles.storeSmall}>Get it on</span>
              <span className={styles.storeName}>Google Play</span>
            </div>
          </a>
        </div>
        <p className={styles.ctaTagline}>
          Free to download · iOS &amp; Android · No account needed to browse
        </p>
      </section>
    </div>
  );
}
