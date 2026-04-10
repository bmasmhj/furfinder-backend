
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

type Context = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const result = await db.query('DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING id', [id, user.id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Comment not found or unauthorized" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Comment deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
