
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';
import { batchRunning, lastRunResult } from '@/lib/batch-match';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const pendingCount = await db.query(
      `SELECT COUNT(*) FROM admin_match_queue WHERE status = 'pending'`
    ).catch(() => ({ rows: [{ count: '0' }] }));

    const totalCount = await db.query(
      `SELECT COUNT(*) FROM admin_match_queue`
    ).catch(() => ({ rows: [{ count: '0' }] }));

    return NextResponse.json({
      running: batchRunning,
      lastRun: lastRunResult,
      pendingCount: parseInt(pendingCount.rows[0].count, 10),
      totalCount: parseInt(totalCount.rows[0].count, 10),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
