
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const body = await request.json();
    const { amount } = body;
    if (!amount || amount <= 0) return NextResponse.json({ message: "Invalid amount" }, { status: 400 });

    const result = await db.query(
      'UPDATE pet_reports SET reward_pool = reward_pool + $1 WHERE id = $2 RETURNING *',
      [amount, id]
    );
    if (result.rows.length === 0) return NextResponse.json({ message: "Report not found" }, { status: 404 });

    await db.query(
      `INSERT INTO timeline_events (report_id, type, description) VALUES ($1, 'sighting', $2)`,
      [id, `$${amount} added to reward pool`]
    );

    return NextResponse.json({ rewardPool: result.rows[0].reward_pool });
  } catch (error) {
    return handleApiError(error);
  }
}
