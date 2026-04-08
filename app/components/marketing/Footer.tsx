import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-brand-200 bg-neutral-50 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-brand-600 mb-4">
              <span>🐾</span>
              <span>Pet Reunite</span>
            </h3>
            <p className="text-sm text-neutral-600">
              Using AI to reunite lost pets with their families. Every pet deserves to go home.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link href="#features" className="hover:text-brand-600 transition">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-brand-600 transition">Pricing</Link></li>
              <li><Link href="/security" className="hover:text-brand-600 transition">Security</Link></li>
              <li><Link href="/api-docs" className="hover:text-brand-600 transition">API Docs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link href="/about" className="hover:text-brand-600 transition">About</Link></li>
              <li><Link href="/blog" className="hover:text-brand-600 transition">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-brand-600 transition">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-brand-600 transition">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link href="/privacy" className="hover:text-brand-600 transition">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-600 transition">Terms</Link></li>
              <li><Link href="/cookies" className="hover:text-brand-600 transition">Cookies</Link></li>
              <li><Link href="/disclaimer" className="hover:text-brand-600 transition">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-brand-200 pt-8 text-center text-sm text-neutral-600">
          <p>&copy; 2024 Pet Reunite AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
