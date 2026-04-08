import { Metadata } from 'next';
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - Pet Reunite AI',
  description: 'Success stories, tips, and news from the Pet Reunite AI community.',
};

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: 'Max\'s Journey Home: A Heartwarming Reunion',
      excerpt: 'How a golden retriever found his way back to his family in just 48 hours using Pet Reunite AI.',
      date: 'April 5, 2024',
      category: 'Success Stories',
    },
    {
      id: 2,
      title: 'Tips for Protecting Your Pet During Travel',
      excerpt: 'Essential safety tips and preventative measures to keep your pet safe while traveling.',
      date: 'April 1, 2024',
      category: 'Pet Safety',
    },
    {
      id: 3,
      title: 'How AI is Revolutionizing Pet Search & Rescue',
      excerpt: 'An inside look at how computer vision and machine learning are improving reunification rates.',
      date: 'March 28, 2024',
      category: 'Technology',
    },
    {
      id: 4,
      title: 'Luna\'s Recovery: When Found Pets Need Extra Care',
      excerpt: 'Tips for caring for recently found pets and preparing them for reunion with their owners.',
      date: 'March 25, 2024',
      category: 'Pet Care',
    },
    {
      id: 5,
      title: 'Building Trust in Your Pet Community',
      excerpt: 'How to create safe, supportive connections with other pet owners in your neighborhood.',
      date: 'March 20, 2024',
      category: 'Community',
    },
    {
      id: 6,
      title: 'Spring Pet Safety: Preparing for Warm Weather',
      excerpt: 'Seasonal tips for keeping your pets safe and healthy as temperatures rise.',
      date: 'March 15, 2024',
      category: 'Pet Safety',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-50 to-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold text-neutral-900 mb-6">Pet Reunite Blog</h1>
            <p className="text-xl text-neutral-600">Success stories, tips, and insights from our community.</p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-8">
              {posts.map((post) => (
                <article key={post.id} className="border-b border-neutral-200 pb-8 last:border-0">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">
                      {post.category}
                    </span>
                    <span className="text-sm text-neutral-500">{post.date}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-3 hover:text-brand-600 transition">
                    <Link href={`/blog/${post.id}`}>
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-neutral-600 mb-4">{post.excerpt}</p>
                  <Link href={`/blog/${post.id}`} className="text-brand-600 font-medium hover:text-brand-700 transition">
                    Read More →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-50">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Stay Updated</h2>
            <p className="text-neutral-600 mb-8">
              Get the latest pet reunification stories, safety tips, and community updates delivered to your inbox.
            </p>
            <form className="flex gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 rounded-lg border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-700 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
