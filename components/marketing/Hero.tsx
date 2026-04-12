import Image from 'next/image'
import Mobile from '@/assets/images/mobile.png'
import { Globe } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-orange-50/50 to-teal-50/30 px-6 py-[72px] pb-[90px] dark:from-background dark:via-orange-950/10 dark:to-teal-950/10">
      {/* Decorative radial gradient */}
      <div className="pointer-events-none absolute left-1/2 top-[-250px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,107,74,0.07)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-x-16 px-6">
        <div className="flex max-w-2xl flex-col justify-center gap-7">
          {/* Pill badge */}
          <div className="inline-flex max-w-fit items-center gap-1.5 rounded-full border border-teal-300/20 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            &#x1F1E6;&#x1F1FA; Australia&apos;s First AI-Powered Pet Recovery App
          </div>

          <h1 className="text-[46px] font-extrabold leading-[1.12] tracking-[-1.5px] text-foreground max-md:text-[30px]">
            Helping bring{' '}
            <span className="text-primary">lost pets</span> home,{' '}
            <em className="not-italic">faster.</em>
          </h1>

          <p className="max-w-[540px] text-[17px] leading-[1.75] text-muted-foreground max-md:text-[15px]">
            Report a lost or found pet, let our AI scan photos for matches, and
            connect with your community — all in one app. Free to download and
            use.
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
            <span>Free to download</span>
            <span className="text-primary">iOS &amp; Android</span>
            <span>Australia-wide</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://apps.apple.com/app/id6759967208"
              className="inline-flex w-full items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(255,107,74,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#e5553a] hover:shadow-[0_8px_24px_rgba(255,107,74,0.35)] md:w-auto"
              target="_blank"
              rel="noreferrer"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download on App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.petreunite.app"
              className="inline-flex w-full items-center gap-2 rounded-xl border-[1.5px] border-border bg-card px-7 py-3.5 text-[15px] font-semibold text-foreground transition-all hover:border-primary hover:text-primary md:w-auto"
              target="_blank"
              rel="noreferrer"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              Get on Google Play
            </a>
            <a
              href="https://app.thefurfinder.com"
              className="inline-flex w-full items-center gap-2 rounded-xl border-[1.5px] border-border bg-card px-7 py-3.5 text-[15px] font-semibold text-foreground transition-all hover:border-primary hover:text-primary md:w-auto"
            >
              <Globe size={18} />
              Try on Web
            </a>
          </div>
        </div>

        <div className="hidden items-center justify-center md:flex">
          <div className="relative">
            <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-primary/10 blur-3xl" />
            <Image
              src={Mobile}
              alt="The Fur Finder mobile app"
              width={300}
              height={580}
              className="relative z-10 drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
