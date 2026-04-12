import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

async function getBlogPost(slug: string) {
  try {
    const blog = await db.queryOne(
      'SELECT *, featured_image_url AS image_url, author_name AS author FROM blogs WHERE slug = $1 AND is_published = true',
      [slug]
    );
    return blog;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

async function getTrendingBlogs() {
  try {
    const blogs = await db.queryMany(
      'SELECT *, featured_image_url AS image_url, author_name AS author FROM blogs WHERE is_published = true ORDER BY created_at DESC LIMIT 3'
    );
    return blogs || [];
  } catch (error) {
    console.error("Error fetching trending blogs:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The blog post you are looking for does not exist.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${slug}`,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  const trendingBlogs = await getTrendingBlogs();

  if (!post) {
    notFound();
  }

  const relatedBlogs = trendingBlogs
    .filter((b: any) => b.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <article className="mx-auto max-w-4xl px-6 py-12 md:py-20">
          <div className="mb-8">
            <Link href="/blog" className="text-primary hover:underline">
              ← Back to articles
            </Link>
          </div>

          <div className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {post.category}
              </span>
              <span className="text-sm text-muted-foreground">By {post.author}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-[-0.02em] text-foreground md:text-5xl">
              {post.title}
            </h1>

            <p className="text-lg leading-8 text-muted-foreground">{post.excerpt}</p>
          </div>

          {post.image_url && (
            <div className="mb-12 h-96 overflow-hidden rounded-2xl bg-muted">
              <img
                src={post.image_url}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-sm max-w-none mb-16 text-muted-foreground leading-8 md:prose-base">
            {post.content.split("\n").map(
              (paragraph: string, i: number) =>
                paragraph.trim() && (
                  <p key={i} className="mb-6">
                    {paragraph}
                  </p>
                )
            )}
          </div>
        </article>

        {/* Related & Trending */}
        <div className="border-t border-border bg-card">
          <div className="mx-auto max-w-4xl px-6 py-12 md:py-20">
            <h2 className="mb-8 text-2xl font-bold tracking-[-0.02em] text-foreground md:text-3xl">
              More articles
            </h2>

            {relatedBlogs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedBlogs.map((blog: any) => (
                  <Link key={blog.id} href={`/blog/${blog.slug}`}>
                    <div className="h-full rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-xs font-medium uppercase text-primary">
                          {blog.category}
                        </span>
                      </div>
                      <h3 className="mb-3 line-clamp-2 text-lg font-bold tracking-[-0.02em] text-foreground">
                        {blog.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {blog.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No more articles available.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
