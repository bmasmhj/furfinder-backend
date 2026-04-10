
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const result = await db.query(
      `SELECT b.blocked_id, u.display_name, b.created_at
       FROM blocked_users b JOIN users u ON u.id = b.blocked_id
       WHERE b.blocker_id = $1 ORDER BY b.created_at DESC`,
      [user.id]
    );

    return NextResponse.json(result.rows.map((r: any) => ({
      id: r.blocked_id,
      displayName: r.display_name,
      blockedAt: typeof r.created_at === 'string' ? r.created_at : r.created_at.toISOString(),
    })));
  } catch (error) {
    return handleApiError(error);
  }
}
