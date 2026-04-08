import Link from 'next/link'
import { appStoreUrl, navLinks } from '@/components/marketing/site-content'

export default function Header() {
  return (
     <div className="nav-wrap ">
      <nav className="nav max-w-7xl">
        <a href='/' className="nav-logo"><span className="paw">&#x1F43E;</span> The Fur Finder</a>
        <div className="nav-links">
          <a href="/#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a href="#our-story">Our Story</a>
          <a href="#download" className="nav-cta">Download Free</a>
        </div>
      </nav>
    </div>
  )
}
