
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

    await db.query("UPDATE ads SET status = 'approved', updated_at = NOW() WHERE id = $1 AND status = 'paused'", [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
