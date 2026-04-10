
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const body = await request.json();
    const { pushToken } = body;
    if (!pushToken) return NextResponse.json({ message: 'Push token is required' }, { status: 400 });

    await db.query('UPDATE users SET push_token = $1 WHERE id = $2', [pushToken, user.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
