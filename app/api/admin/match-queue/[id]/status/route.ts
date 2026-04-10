
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { status } = await request.json();
    if (!['reviewed', 'dismissed', 'actioned', 'pending'].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    await db.query(
      `UPDATE admin_match_queue SET status = $1, reviewed_at = NOW() WHERE id = $2`,
      [status, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
