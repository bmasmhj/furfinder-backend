import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketingSection } from '@/components/marketing/MarketingPrimitives'

export const metadata: Metadata = {
  title: 'Stories & Updates - The Fur Finder',
  description: 'Stories, product updates, and practical advice from The Fur Finder.',
}

async function getBlogPosts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/v1/public/blogs?limit=20`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
    
    if (!response.ok) {
      console.error('Failed to fetch blogs:', response.status)
      return []
    }
    
    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a2e]">
      <main>
        <section className="bg-[linear-gradient(180deg,#fff_0%,#fff5f3_100%)] px-6 py-20 text-center md:px-8">
          <span className="inline-flex rounded-full bg-[#fff1ed] px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#ff6b4a]">
            Stories & Updates
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] md:text-6xl">Stories from the search, the rescue, and the reunion.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#6b7280]">
            Discover inspiring stories of pets reunited with their families and learn practical tips for keeping your pet safe.
          </p>
        </section>

        <MarketingSection title="Latest articles" description="A compact editorial layout that matches the homepage visual system.">
          {posts.length > 0 ? (
            <div className="space-y-5">
              {posts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="rounded-3xl border border-[#e5e7eb] bg-white p-8 transition-shadow hover:shadow-md">
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="rounded-full bg-[#fff1ed] px-3 py-1 font-medium text-[#ff6b4a]">{post.category}</span>
                      <span className="text-[#9ca3af]">
                        {new Date(post.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </span>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold tracking-[-0.02em] text-[#1a1a2e]">{post.title}</h2>
                    <p className="mt-3 max-w-3xl text-sm leading-8 text-[#6b7280]">{post.excerpt}</p>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#e5e7eb] bg-white p-8 text-center">
              <p className="text-[#6b7280]">No blog posts available at the moment. Check back soon!</p>
            </div>
          )}
        </MarketingSection>
      </main>
    </div>
  )
}
