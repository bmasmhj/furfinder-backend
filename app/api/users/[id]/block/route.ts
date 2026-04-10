
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

    if (id === user.id) {
      return NextResponse.json({ message: "You cannot block yourself" }, { status: 400 });
    }

    try {
      await db.query(
        'INSERT INTO blocked_users (blocker_id, blocked_id) VALUES ($1, $2)',
        [user.id, id]
      );
    } catch (e: any) {
      if (e.code === '23505') {
        return NextResponse.json({ message: "User already blocked" });
      }
      throw e;
    }

    return NextResponse.json({ message: "User blocked" });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    await db.query(
      'DELETE FROM blocked_users WHERE blocker_id = $1 AND blocked_id = $2',
      [user.id, id]
    );

    return NextResponse.json({ message: "User unblocked" });
  } catch (error) {
    return handleApiError(error);
  }
}
