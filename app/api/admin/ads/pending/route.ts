
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const result = await db.query(
      `SELECT a.*, u.email as user_email
       FROM ads a
       JOIN users u ON a.user_id = u.id
       WHERE a.status = 'pending'
       ORDER BY a.created_at DESC`
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    return handleApiError(error);
  }
}
