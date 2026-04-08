import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'Sign Up - Pet Reunite AI',
  description: 'Create your account to start reuniting with your pet.',
};

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create Account</h1>
            <p className="text-neutral-600 mb-6">Join thousands of pet owners finding their companions.</p>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">Password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">Confirm Password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" id="terms" className="mt-1" />
                <label htmlFor="terms" className="text-sm text-neutral-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-brand-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-brand-600 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 transition"
              >
                Create Account
              </button>
            </form>

            <p className="mt-6 text-center text-neutral-600">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-600 font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
