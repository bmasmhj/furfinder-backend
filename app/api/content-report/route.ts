
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const body = await request.json();
    const { reportId, commentId, reason, details } = body;
    
    if (!reason) return NextResponse.json({ message: "Reason is required" }, { status: 400 });
    if (!reportId && !commentId) return NextResponse.json({ message: "Must specify a report or comment to flag" }, { status: 400 });

    await db.query(
      'INSERT INTO content_reports (reporter_id, report_id, comment_id, reason, details) VALUES ($1, $2, $3, $4, $5)',
      [user.id, reportId || null, commentId || null, reason, details || null]
    );

    return NextResponse.json({ message: "Content reported. We will review it shortly." });
  } catch (error) {
    return handleApiError(error);
  }
}
