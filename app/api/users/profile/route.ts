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
      `SELECT id, email, display_name, phone, address, city, state, country, avatar_url, bio, created_at, updated_at
       FROM users WHERE id = $1`,
      [decoded.id]
    );

    if (result.rows.length === 0) {
      throw new ApiError('User not found', 404);
    }

    return NextResponse.json({ user: result.rows[0] }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Unauthorized', 401);
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);

    const body = await request.json();
    const { display_name, phone, address, city, state, country, avatar_url, bio } = body;

    const result = await db.query(
      `UPDATE users 
       SET display_name = COALESCE($1, display_name),
           phone = COALESCE($2, phone),
           address = COALESCE($3, address),
           city = COALESCE($4, city),
           state = COALESCE($5, state),
           country = COALESCE($6, country),
           avatar_url = COALESCE($7, avatar_url),
           bio = COALESCE($8, bio),
           updated_at = NOW()
       WHERE id = $9
       RETURNING id, email, display_name, phone, address, city, state, country, avatar_url, bio, created_at, updated_at`,
      [display_name, phone, address, city, state, country, avatar_url, bio, decoded.id]
    );

    return NextResponse.json({ user: result.rows[0] }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
