import Link from 'next/link'

export default function Header() {
  return (
    <div className="nav-wrap ">
      <nav className="nav max-w-7xl">
        <Link href='/' className="nav-logo"><span className="paw">&#x1F43E;</span> The Fur Finder</Link>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/features">Features</Link>
          <Link href="/how-it-works">How It Works</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/about">Our Story</Link>
          <Link href="#download" className="nav-cta">Download Free</Link>
        </div>
      </nav>
    </div>
  )
}
