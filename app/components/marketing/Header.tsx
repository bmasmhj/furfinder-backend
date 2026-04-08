import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-200 bg-white/80 backdrop-blur-sm">
      <nav className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-brand-600">
            <span>🐾</span>
            <span>Pet Reunite</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-neutral-700 hover:text-brand-600 transition">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-neutral-700 hover:text-brand-600 transition">
              How It Works
            </Link>
            <Link href="/blog" className="text-sm font-medium text-neutral-700 hover:text-brand-600 transition">
              Stories
            </Link>
            <Link href="/about" className="text-sm font-medium text-neutral-700 hover:text-brand-600 transition">
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-neutral-700 hover:text-brand-600 transition">
              Log in
            </Link>
            <Link href="/signup" className="rounded-full bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
