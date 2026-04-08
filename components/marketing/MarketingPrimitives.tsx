import type { ReactNode } from 'react'
import Link from 'next/link'

export function MarketingSection({
  id,
  eyebrow,
  eyebrowTone = 'coral',
  title,
  description,
  centered = false,
  className = '',
  children,
}: {
  id?: string
  eyebrow?: string
  eyebrowTone?: 'coral' | 'teal' | 'purple'
  title?: string
  description?: string
  centered?: boolean
  className?: string
  children: ReactNode
}) {
  const eyebrowToneClass =
    eyebrowTone === 'teal'
      ? 'bg-[#e8f8f7] text-[#2cbcb6]'
      : eyebrowTone === 'purple'
        ? 'bg-[#eef2ff] text-[#6366f1]'
        : 'bg-[#fff1ed] text-[#ff6b4a]'

  return (
    <section id={id} className={`mx-auto max-w-6xl  py-16  ${className}`}>
      <div className={centered ? 'text-center' : ''}>
        {eyebrow ? (
          <span
            className={`mb-4 inline-flex rounded-full px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${eyebrowToneClass}`}
          >
            {eyebrow}
          </span>
        ) : null}
        <h2 className="text-3xl font-bold tracking-[-0.03em] text-[#1a1a2e] md:text-4xl">{title}</h2>
        {description ? (
          <p
            className={`mt-3 text-[15px] leading-7 text-[#6b7280] ${
              centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'
            }`}
          >
            {description}
          </p>
        ) : null}
      </div>
      <div className="mt-10">{children}</div>
    </section>
  )
}

export function DownloadButton({
  href,
  variant = 'primary',
  children,
  external = true,
}: {
  href: string
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
  external?: boolean
}) {
  const className =
    variant === 'secondary'
      ? 'border border-[#e5e7eb] bg-white text-[#1a1a2e] hover:border-[#ff6b4a] hover:text-[#ff6b4a]'
      : variant === 'ghost'
        ? 'bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]'
        : 'bg-[#ff6b4a] text-white shadow-[0_10px_30px_rgba(255,107,74,0.25)] hover:bg-[#e5553a]'

  const props = external
    ? { target: '_blank', rel: 'noreferrer' }
    : {}

  return (
    <Link
      href={href}
      {...props}
      className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition ${className}`}
    >
      {children}
    </Link>
  )
}

export function LegalPageLayout({
  tone = 'coral',
  title,
  subtitle,
  meta,
  children,
}: {
  tone?: 'coral' | 'teal'
  title: string
  subtitle: string
  meta?: string
  children: ReactNode
}) {
  const bgClass =
    tone === 'teal'
      ? 'from-[#2cbcb6] to-[#5dd4cf]'
      : 'from-[#ff6b4a] to-[#ff8a6e]'

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a2e]">
      <div className={`bg-gradient-to-br ${bgClass} px-6 py-12 text-center`}>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="mt-2 text-sm text-white/90">{subtitle}</p>
      </div>
      <div className="mx-auto max-w-4xl px-6 py-10">
        {meta ? <p className="mb-6 text-sm text-[#8e8ea0]">{meta}</p> : null}
        <div className="space-y-8">{children}</div>
      </div>
    </div>
  )
}

export function LegalSection({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-[#1a1a2e]">{title}</h2>
      <p className="mt-3 whitespace-pre-line text-[15px] leading-8 text-[#4a4a6a]">{body}</p>
    </section>
  )
}
