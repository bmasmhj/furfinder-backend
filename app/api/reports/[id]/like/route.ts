
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const existing = await db.query(
      'SELECT id FROM report_likes WHERE report_id = $1 AND user_id = $2',
      [id, user.id]
    );

    let likedByMe = false;
    if (existing.rows.length > 0) {
      await db.query('DELETE FROM report_likes WHERE report_id = $1 AND user_id = $2', [id, user.id]);
      likedByMe = false;
    } else {
      await db.query('INSERT INTO report_likes (report_id, user_id) VALUES ($1, $2)', [id, user.id]);
      likedByMe = true;
    }

    const countResult = await db.query('SELECT COUNT(*)::int AS count FROM report_likes WHERE report_id = $1', [id]);
    return NextResponse.json({ likes: countResult.rows[0].count, likedByMe });
  } catch (error) {
    return handleApiError(error);
  }
}
