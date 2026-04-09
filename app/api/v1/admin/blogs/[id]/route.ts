import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch a specific blog
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const blog = await db.queryOne(
      'SELECT * FROM blogs WHERE id = $1',
      [id]
    );

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: blog }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT - Update a blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, slug, excerpt, content, image_url, author, category, is_published } = body;

    const blog = await db.queryOne(
      'SELECT * FROM blogs WHERE id = $1',
      [id]
    );

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    const result = await db.queryOne(
      `UPDATE blogs 
       SET title = $1, slug = $2, excerpt = $3, content = $4, image_url = $5, 
           author = $6, category = $7, is_published = $8, updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [
        title || blog.title,
        slug || blog.slug,
        excerpt || blog.excerpt,
        content || blog.content,
        image_url || blog.image_url,
        author || blog.author,
        category || blog.category,
        is_published !== undefined ? is_published : blog.is_published,
        id
      ]
    );

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const blog = await db.queryOne(
      'SELECT * FROM blogs WHERE id = $1',
      [id]
    );

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    await db.execute('DELETE FROM blogs WHERE id = $1', [id]);

    return NextResponse.json(
      { message: 'Blog deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
