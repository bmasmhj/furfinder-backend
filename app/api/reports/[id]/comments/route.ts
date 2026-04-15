
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { author, text } = body;
    if (!text) return NextResponse.json({ message: "Comment text is required" }, { status: 400 });

    const user = await getCurrentUser();
    const authorName = author || (user ? user.display_name : 'Anonymous');
    
    const result = await db.query(
      'INSERT INTO comments (report_id, user_id, author, text) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, user?.id || null, authorName, text]
    );

    await db.query(
      `INSERT INTO timeline_events (report_id, type, description) VALUES ($1, 'comment', $2)`,
      [id, `${authorName} commented: "${text.slice(0, 50)}${text.length > 50 ? '...' : ''}"`]
    );

    const c = result.rows[0];
    return NextResponse.json({ 
      id: c.id, 
      author: c.author, 
      text: c.text, 
      createdAt: c.created_at instanceof Date ? c.created_at.toISOString() : c.created_at 
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
