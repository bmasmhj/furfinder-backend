
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ApiError, handleApiError } from '@/lib/api-errors';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Authentication required', 401);
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);

    const result = await db.query(
      'SELECT id, email, display_name, phone, role FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      throw new ApiError('User not found', 404);
    }

    const row = result.rows[0];
    return NextResponse.json({
      id: row.id,
      email: row.email,
      displayName: row.display_name, // Match original camelCase camelCase
      phone: row.phone,
      role: row.role || 'user',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
