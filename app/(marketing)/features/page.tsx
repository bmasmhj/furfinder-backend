import { Metadata } from 'next';
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'Features - Pet Reunite AI',
  description: 'Explore the powerful features that make Pet Reunite AI the leading pet matching platform.',
};

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-50 to-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold text-neutral-900 mb-6">Powerful Features for Pet Reunification</h1>
            <p className="text-xl text-neutral-600">Advanced tools designed to help you find your pet faster.</p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Feature 1 */}
              <div className="flex flex-col justify-center">
                <div className="text-5xl mb-4">🖼️</div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">AI-Powered Photo Matching</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Our advanced computer vision AI analyzes pet photos to identify key features like breed, color patterns, and distinctive marks. This enables accurate matching with found pets in real time.
                </p>
              </div>
              <div className="bg-brand-50 rounded-xl h-64 flex items-center justify-center text-6xl">
                📸
              </div>

              {/* Feature 2 */}
              <div className="bg-brand-50 rounded-xl h-64 flex items-center justify-center text-6xl order-2 md:order-1">
                📍
              </div>
              <div className="flex flex-col justify-center order-1 md:order-2">
                <div className="text-5xl mb-4">📍</div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">Location-Based Alerts</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Get instant notifications when pets are reported in your area. Our geographic matching ensures you see the most relevant reports near your pet&apos;s last known location.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col justify-center">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">Direct Messaging</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Communicate securely with other pet owners and coordinators. Share additional photos, medical records, and reunion plans directly through our platform.
                </p>
              </div>
              <div className="bg-brand-50 rounded-xl h-64 flex items-center justify-center text-6xl">
                💭
              </div>

              {/* Feature 4 */}
              <div className="bg-brand-50 rounded-xl h-64 flex items-center justify-center text-6xl order-2 md:order-1">
                📱
              </div>
              <div className="flex flex-col justify-center order-1 md:order-2">
                <div className="text-5xl mb-4">📱</div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">Mobile-First Experience</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Report a missing pet in seconds using our mobile app. Browse matches, upload photos, and stay connected to your pet&apos;s search on the go.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="flex flex-col justify-center">
                <div className="text-5xl mb-4">🔐</div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">Verified Community</h3>
                <p className="text-neutral-600 leading-relaxed">
                  All members are verified to ensure safety and authenticity. Reunite with confidence knowing you&apos;re connecting with trustworthy community members.
                </p>
              </div>
              <div className="bg-brand-50 rounded-xl h-64 flex items-center justify-center text-6xl">
                ✅
              </div>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold text-neutral-900 mb-12 text-center">Why Choose Pet Reunite AI?</h2>
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-brand-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-neutral-900">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold text-neutral-900">Pet Reunite AI</th>
                    <th className="px-6 py-4 text-center font-semibold text-neutral-900">Social Media</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-200">
                    <td className="px-6 py-4 text-neutral-900">AI Photo Matching</td>
                    <td className="px-6 py-4 text-center text-green-600 font-bold">✓</td>
                    <td className="px-6 py-4 text-center text-neutral-400">✗</td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="px-6 py-4 text-neutral-900">Location-Based Search</td>
                    <td className="px-6 py-4 text-center text-green-600 font-bold">✓</td>
                    <td className="px-6 py-4 text-center text-neutral-400">✗</td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="px-6 py-4 text-neutral-900">24/7 Active Matching</td>
                    <td className="px-6 py-4 text-center text-green-600 font-bold">✓</td>
                    <td className="px-6 py-4 text-center text-neutral-400">✗</td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="px-6 py-4 text-neutral-900">Direct Messaging</td>
                    <td className="px-6 py-4 text-center text-green-600 font-bold">✓</td>
                    <td className="px-6 py-4 text-center text-green-600">✓</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-neutral-900">Verified Community</td>
                    <td className="px-6 py-4 text-center text-green-600 font-bold">✓</td>
                    <td className="px-6 py-4 text-center text-neutral-400">✗</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
