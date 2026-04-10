
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const userId = user.id;

    await db.query('DELETE FROM comments WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM report_likes WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM notifications WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM content_reports WHERE reporter_id = $1', [userId]);
    await db.query('DELETE FROM blocked_users WHERE blocker_id = $1 OR blocked_id = $1', [userId]);
    await db.query('DELETE FROM referral_shares WHERE user_id = $1', [userId]);

    const profileIds = await db.query('SELECT id FROM pet_profiles WHERE user_id = $1', [userId]);
    for (const p of profileIds.rows) {
      await db.query('DELETE FROM biometric_scans WHERE profile_id = $1', [p.id]);
    }
    await db.query('DELETE FROM pet_profiles WHERE user_id = $1', [userId]);

    const reportIds = await db.query('SELECT id FROM pet_reports WHERE user_id = $1', [userId]);
    for (const r of reportIds.rows) {
      await db.query('DELETE FROM timeline_events WHERE report_id = $1', [r.id]);
      await db.query('DELETE FROM comments WHERE report_id = $1', [r.id]);
      await db.query('DELETE FROM report_likes WHERE report_id = $1', [r.id]);
    }
    await db.query('DELETE FROM pet_reports WHERE user_id = $1', [userId]);

    await db.query('DELETE FROM users WHERE id = $1', [userId]);

    return NextResponse.json({ message: "Account and all associated data deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
