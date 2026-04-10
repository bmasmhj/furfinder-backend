
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';
import { sendPushNotification } from '@/lib/push';

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const queueRow = await db.query(
      `SELECT q.lost_report_id, q.found_report_id, q.confidence, q.reason,
              l.pet_name, l.user_id AS owner_id,
              u.push_token AS owner_push_token, u.display_name AS owner_name
       FROM admin_match_queue q
       JOIN pet_reports l ON l.id = q.lost_report_id
       JOIN users u ON u.id = l.user_id
       WHERE q.id = $1`,
      [id]
    );

    if (queueRow.rows.length === 0) {
      return NextResponse.json({ message: "Match not found" }, { status: 404 });
    }

    const match = queueRow.rows[0];
    const title = `Possible match found for ${match.pet_name}!`;
    const message = `Our team reviewed a potential match for your lost pet. Open The Fur Finder to see the details — it could be yours!`;

    await db.query(
      `INSERT INTO notifications (user_id, type, title, message, report_id)
       VALUES ($1, 'ai_match', $2, $3, $4)`,
      [match.owner_id, title, message, match.lost_report_id]
    );

    sendPushNotification(match.owner_push_token, match.owner_id, title, message, {
      type: 'ai_match',
      reportId: match.lost_report_id,
    }).catch((err: any) => console.error("Notify owner push error:", err));

    await db.query(
      `UPDATE admin_match_queue SET status = 'actioned', reviewed_at = NOW() WHERE id = $1`,
      [id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
