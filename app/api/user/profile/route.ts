
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const body = await request.json();
    const { phone } = body;
    
    await db.query('UPDATE users SET phone = $1 WHERE id = $2', [phone ?? null, user.id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
