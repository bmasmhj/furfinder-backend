
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';
import { sendPushNotification } from '@/lib/push';

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { id: foundReportId } = await params;
    const { lostReportId } = await request.json();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    // Validate user owns lostReportId
    const lostReport = await db.queryOne(
      'SELECT id, user_id, pet_name FROM pet_reports WHERE id = $1',
      [lostReportId]
    );

    if (!lostReport) {
      return NextResponse.json({ message: 'Lost report not found' }, { status: 404 });
    }

    if (lostReport.user_id !== user.id) {
      return NextResponse.json({ message: 'Not authorized for this lost report' }, { status: 403 });
    }

    // Validate target report is "found"
    const foundReport = await db.queryOne(
      'SELECT id, user_id, status, pet_name FROM pet_reports WHERE id = $1',
      [foundReportId]
    );

    if (!foundReport) {
      return NextResponse.json({ message: 'Found report not found' }, { status: 404 });
    }

    if (foundReport.status !== 'found') {
      return NextResponse.json({ message: 'Target report is not a found pet' }, { status: 400 });
    }

    // Check if claim already exists
    const existing = await db.queryOne(
      'SELECT id FROM claim_requests WHERE lost_report_id = $1 AND found_report_id = $2 AND status = $3',
      [lostReportId, foundReportId, 'pending']
    );

    if (existing) {
      return NextResponse.json({ message: 'Claim request already pending' }, { status: 400 });
    }

    // Create claim request
    const result = await db.queryOne(
      `INSERT INTO claim_requests (lost_report_id, found_report_id, claimer_user_id, found_user_id, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING *`,
      [lostReportId, foundReportId, user.id, foundReport.user_id]
    );

    // Notify found report owner
    const foundUser = await db.queryOne(
      'SELECT push_token FROM users WHERE id = $1',
      [foundReport.user_id]
    );

    const title = 'New Claim Request';
    const message = `Someone thinks the ${foundReport.pet_name} you found might belong to them.`;

    await db.query(
      `INSERT INTO notifications (user_id, type, title, message, report_id)
       VALUES ($1, 'claim_received', $2, $3, $4)`,
      [foundReport.user_id, title, message, foundReportId]
    );

    if (foundUser?.push_token) {
      sendPushNotification(foundUser.push_token, foundReport.user_id, title, message, {
        type: 'claim_received',
        reportId: foundReportId,
        claimId: result.id,
      }).catch(err => console.error('[Claim] Push error:', err));
    }

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
