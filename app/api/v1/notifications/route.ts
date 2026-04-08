import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ApiError, handleApiError } from '@/lib/api-errors';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Unauthorized', 401);
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);

    const result = await db.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
      [decoded.userId]
    );

    return NextResponse.json({ notifications: result.rows }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Unauthorized', 401);
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);

    const body = await request.json();
    const { notification_type, title, message, related_item_id } = body;

    const result = await db.query(
      `INSERT INTO notifications (user_id, notification_type, title, message, related_item_id, is_read, created_at)
       VALUES ($1, $2, $3, $4, $5, false, NOW())
       RETURNING *`,
      [decoded.userId, notification_type, title, message, related_item_id]
    );

    return NextResponse.json({ notification: result.rows[0] }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
