import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'Log In - Pet Reunite AI',
  description: 'Log in to your Pet Reunite AI account.',
};

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Welcome Back</h1>
            <p className="text-neutral-600 mb-6">Log in to continue your pet search.</p>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-neutral-900">Password</label>
                  <Link href="/forgot-password" className="text-sm text-brand-600 hover:underline">
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember" className="text-sm text-neutral-600">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700 transition"
              >
                Log In
              </button>
            </form>

            <p className="mt-6 text-center text-neutral-600">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-brand-600 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
