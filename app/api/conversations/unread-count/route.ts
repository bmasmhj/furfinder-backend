
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const result = await db.query(
      `SELECT COUNT(*)::int AS count FROM messages m
       JOIN conversations c ON c.id = m.conversation_id
       WHERE m.sender_id != $1 AND m.read = false
         AND (c.participant1_id = $1 OR c.participant2_id = $1)`,
      [user.id]
    );
    
    return NextResponse.json({ count: result.rows[0].count });
  } catch (error) {
    return handleApiError(error);
  }
}
