import { Metadata } from 'next';
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'Contact Us - Pet Reunite AI',
  description: 'Get in touch with our support team. We\'re here to help.',
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-50 to-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold text-neutral-900 mb-6">Get in Touch</h1>
            <p className="text-xl text-neutral-600">Have questions? We&apos;re here to help.</p>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="mx-auto max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Subject</label>
                  <select className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600">
                    <option>General Inquiry</option>
                    <option>Lost Pet Report</option>
                    <option>Found Pet Report</option>
                    <option>Technical Issue</option>
                    <option>Feedback</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">Message</label>
                  <textarea
                    rows={6}
                    className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-600"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-700 transition"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Email</h3>
                <p className="text-neutral-600">
                  <a href="mailto:support@petreunite.ai" className="hover:text-brand-600 transition">
                    support@petreunite.ai
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Emergency Support</h3>
                <p className="text-neutral-600">
                  For urgent pet reunification cases, call our 24/7 hotline: <br />
                  <a href="tel:+1-800-PET-FOUND" className="font-semibold hover:text-brand-600 transition">
                    +1-800-PET-FOUND
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Office Hours</h3>
                <p className="text-neutral-600">
                  Monday - Friday: 9:00 AM - 6:00 PM PT <br />
                  Saturday - Sunday: 10:00 AM - 4:00 PM PT
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="text-brand-600 hover:text-brand-700 transition text-2xl">f</a>
                  <a href="#" className="text-brand-600 hover:text-brand-700 transition text-2xl">𝕏</a>
                  <a href="#" className="text-brand-600 hover:text-brand-700 transition text-2xl">📷</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Is Pet Reunite AI free to use?',
                  a: 'Yes! Creating an account and reporting a lost or found pet is completely free. We never charge pet owners to help reunite with their companions.',
                },
                {
                  q: 'How quickly will I see matches?',
                  a: 'Our AI begins analyzing and matching reports immediately. Most users see potential matches within 24-48 hours.',
                },
                {
                  q: 'Is my pet&apos;s information safe?',
                  a: 'Absolutely. We use enterprise-grade encryption and never share your information without permission.',
                },
                {
                  q: 'What if I find a pet?',
                  a: 'You can report found pets in our system, and we&apos;ll notify owners whose lost pet matches the description.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg border border-neutral-200">
                  <h3 className="font-bold text-neutral-900 mb-3">{faq.q}</h3>
                  <p className="text-neutral-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
