import Link from "next/link";
import { appStoreUrl, playStoreUrl } from "@/components/marketing/site-content";

export default function Footer() {
  return (
    <footer className="bg-[#080808] px-6 py-14 text-[#9ca3af]">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-white">
              <span>🐾</span>
              <span>The Fur Finder</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-7 text-[#6b7280]">
              Australia&apos;s AI-powered lost and found pets platform.
              Reuniting pets with their families, one report at a time.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              App
            </h4>
            <div className="space-y-2 text-sm">
              <Link
                href={appStoreUrl}
                target="_blank"
                rel="noreferrer"
                className="block transition hover:text-[#ff6b4a]"
              >
                App Store
              </Link>
              <Link
                href={playStoreUrl}
                target="_blank"
                rel="noreferrer"
                className="block transition hover:text-[#ff6b4a]"
              >
                Google Play
              </Link>
              <Link
                href="/pricing"
                className="block transition hover:text-[#ff6b4a]"
              >
                Pricing
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              Resources
            </h4>
            <div className="space-y-2 text-sm">
              <Link
                href="/how-it-works"
                className="block transition hover:text-[#ff6b4a]"
              >
                How It Works
              </Link>
              <Link
                href="/faq"
                className="block transition hover:text-[#ff6b4a]"
              >
                FAQ
              </Link>
              <Link
                href="/blog"
                className="block transition hover:text-[#ff6b4a]"
              >
                Blog
              </Link>
              <Link
                href="/reunited-stories"
                className="block transition hover:text-[#ff6b4a]"
              >
                Reunited Stories
              </Link>
              <Link
                href="/about"
                className="block transition hover:text-[#ff6b4a]"
              >
                Our Story
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              Legal
            </h4>
            <div className="space-y-2 text-sm">
              <Link
                href="/privacy-policy"
                className="block transition hover:text-[#ff6b4a]"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-use"
                className="block transition hover:text-[#ff6b4a]"
              >
                Terms of Use
              </Link>
              <Link
                href="/delete-account"
                className="block transition hover:text-[#ff6b4a]"
              >
                Delete Account
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[#1f1f1f] pt-7 text-xs text-[#4b5563] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 The Fur Finder. Made with love in Australia.</p>
          <div className="flex gap-5">
            <Link
              href="/privacy-policy"
              className="transition hover:text-[#ff6b4a]"
            >
              Privacy
            </Link>
            <Link
              href="/terms-of-use"
              className="transition hover:text-[#ff6b4a]"
            >
              Terms
            </Link>
            <Link
              href="/delete-account"
              className="transition hover:text-[#ff6b4a]"
            >
              Delete Account
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
