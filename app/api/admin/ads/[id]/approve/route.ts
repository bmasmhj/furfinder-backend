
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { startDate, endDate, durationDays } = await request.json();

    await db.query(
      `UPDATE ads 
       SET status = 'approved', 
           start_date = $1, 
           end_date = $2, 
           duration_days = $3, 
           approved_at = $1, 
           approved_by = $4 
       WHERE id = $5`,
      [startDate || new Date(), endDate || null, durationDays || 30, user.id, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
