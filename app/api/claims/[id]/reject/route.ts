
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';
import { sendPushNotification } from '@/lib/push';

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { id: claimId } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const claim = await db.queryOne(
      'SELECT * FROM claim_requests WHERE id = $1',
      [claimId]
    );

    if (!claim) {
      return NextResponse.json({ message: 'Claim request not found' }, { status: 404 });
    }

    if (claim.found_user_id !== user.id) {
      return NextResponse.json({ message: 'Not authorized to reject this claim' }, { status: 403 });
    }

    await db.query(
      "UPDATE claim_requests SET status = 'rejected' WHERE id = $1",
      [claimId]
    );

    // Notify claimer
    const claimer = await db.queryOne(
      'SELECT push_token FROM users WHERE id = $1',
      [claim.claimer_user_id]
    );

    const title = 'Claim Rejected';
    const message = 'Your claim was not approved.';

    await db.query(
      `INSERT INTO notifications (user_id, type, title, message, report_id)
       VALUES ($1, 'claim_rejected', $2, $3, $4)`,
      [claim.claimer_user_id, title, message, claim.lost_report_id]
    );

    if (claimer?.push_token) {
      sendPushNotification(claimer.push_token, claim.claimer_user_id, title, message, {
        type: 'claim_rejected',
        reportId: claim.lost_report_id,
        claimId: claimId,
      }).catch(err => console.error('[Reject] Push error:', err));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
