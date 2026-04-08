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
      `SELECT c.*, 
              u1.full_name as user1_name,
              u2.full_name as user2_name
       FROM conversations c
       JOIN users u1 ON c.user1_id = u1.id
       JOIN users u2 ON c.user2_id = u2.id
       WHERE c.user1_id = $1 OR c.user2_id = $1
       ORDER BY c.updated_at DESC`,
      [decoded.userId]
    );

    return NextResponse.json({ conversations: result.rows }, { status: 200 });
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
    const { user2_id } = body;

    const result = await db.query(
      `INSERT INTO conversations (user1_id, user2_id, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING *`,
      [decoded.userId, user2_id]
    );

    return NextResponse.json({ conversation: result.rows[0] }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
