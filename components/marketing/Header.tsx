import Link from 'next/link'
import { appStoreUrl, navLinks } from '@/components/marketing/site-content'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e7eb]/80 bg-[rgba(250,250,250,0.92)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-[#1a1a2e]">
          <span className="text-xl text-[#ff6b4a]">🐾</span>
          <span>The Fur Finder</span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-[#6b7280] transition hover:text-[#ff6b4a]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={appStoreUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#ff6b4a] px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#e5553a]"
          >
            Download Free
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Link href="/features" className="text-sm font-medium text-[#6b7280]">
            Features
          </Link>
          <Link
            href={appStoreUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#ff6b4a] px-4 py-2 text-sm font-semibold text-white"
          >
            Download
          </Link>
        </div>
      </nav>
    </header>
  )
}
