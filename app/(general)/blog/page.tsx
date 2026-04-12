import type { Metadata } from "next";
import Link from "next/link";
import { MarketingSection } from "@/components/marketing/MarketingPrimitives";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Blog & Stories - The Fur Finder",
  description:
    "Practical advice, stories from the search, and product updates from Australia's AI-powered pet recovery platform.",
};

async function getBlogPosts() {
  try {
    const blogs = await db.queryMany(
      'SELECT *, featured_image_url AS image_url, author_name AS author FROM blogs WHERE is_published = true ORDER BY created_at DESC LIMIT 20'
    );
    return blogs || [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const remainingPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Blog Header */}
        <section className="border-b border-border bg-background px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <span className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">
              Our Blog
            </span>
            <h1 className="mt-4 mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              Stories, updates &{" "}
              <span className="text-primary">pet advice.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Expert tips on pet safety, heartwarming reunion stories, and the
              latest from The Fur Finder team.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-16">
          {featuredPost && (
            <div className="mb-20">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group relative block overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 overflow-hidden bg-muted md:h-[450px]">
                    {featuredPost.image_url ? (
                      <img
                        src={featuredPost.image_url}
                        alt={featuredPost.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">
                        🐾
                      </div>
                    )}
                    <div className="absolute left-6 top-6">
                      <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                        Featured Post
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-8 md:p-12">
                    <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-semibold uppercase tracking-wider text-primary">
                        {featuredPost.category}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(featuredPost.created_at).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric", year: "numeric" }
                        )}
                      </span>
                    </div>
                    <h2 className="mb-6 text-3xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary md:text-4xl">
                      {featuredPost.title}
                    </h2>
                    <p className="mb-8 line-clamp-3 text-lg leading-relaxed text-muted-foreground">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-3">
                      {featuredPost.author_image && (
                        <img
                          src={featuredPost.author_image}
                          alt={featuredPost.author_name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <span className="block text-sm font-bold text-foreground">
                          {featuredPost.author_name || "The Fur Finder Team"}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {featuredPost.read_time || "5 min read"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {remainingPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {remainingPosts.map((post: any) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden bg-muted">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">
                        🐾
                      </div>
                    )}
                  </div>
                  <div className="flex flex-grow flex-col p-8">
                    <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-bold uppercase tracking-wider text-primary">
                        {post.category}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="mb-4 line-clamp-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="mb-6 line-clamp-3 flex-grow text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between border-t border-border pt-6">
                      <span className="text-xs font-semibold text-foreground">
                        {post.author_name || "Admin"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {post.read_time || "4 min read"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            !featuredPost && (
              <div className="rounded-3xl border border-dashed border-border bg-card py-20 text-center">
                <p className="text-lg text-muted-foreground">
                  New stories are coming soon. Stay tuned!
                </p>
              </div>
            )
          )}

          <div className="mt-16 text-center">
            <button className="inline-flex items-center rounded-xl border border-border bg-card px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-primary hover:text-primary">
              Load More Posts
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
