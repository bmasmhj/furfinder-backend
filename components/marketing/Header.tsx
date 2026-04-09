'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/features', label: 'Features' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/faq', label: 'FAQ' },
    { href: '/blog', label: 'Blog' },
    { href: '/reunited-stories', label: 'Reunited Stories' },
    { href: '/about', label: 'Our Story' },
  ]

  return (
    <div className="nav-wrap sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e5e7eb]">
      <nav className="nav max-w-7xl mx-auto px-6 py-4">
        <Link href='/' className="nav-logo"><span className="paw">🐾</span> The Fur Finder</Link>
        <div className="nav-links">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors px-3 py-2 rounded-lg ${
                isActive(href)
                  ? 'text-[#ff6b4a] font-semibold bg-[#fff5f3]'
                  : 'text-[#1a1a2e] hover:text-[#ff6b4a]'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link href="#download" className="nav-cta">Download Free</Link>
        </div>
      </nav>
    </div>
  )
}
