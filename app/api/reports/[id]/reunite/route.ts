
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { message: reunionMsg } = body;
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const existing = await db.query('SELECT user_id, pet_name FROM pet_reports WHERE id = $1', [id]);
    if (existing.rows.length === 0) return NextResponse.json({ message: "Report not found" }, { status: 404 });
    if (existing.rows[0].user_id !== user.id) return NextResponse.json({ message: "Not authorized" }, { status: 403 });

    const msg = reunionMsg || `${existing.rows[0].pet_name} has been reunited with their owner!`;
    const result = await db.query(
      `UPDATE pet_reports SET status = 'reunited', reunion_message = $1, reunion_date = NOW() WHERE id = $2 RETURNING *`,
      [msg, id]
    );

    await db.query(
      `INSERT INTO timeline_events (report_id, type, description) VALUES ($1, 'status_change', 'Pet reunited with owner!')`,
      [id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return handleApiError(error);
  }
}
