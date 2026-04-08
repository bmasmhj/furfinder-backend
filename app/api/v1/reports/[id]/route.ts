import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ApiError, handleApiError } from '@/lib/api-errors';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await db.query(
      'SELECT * FROM reports WHERE id = $1',
      [params.id]
    );

    if (result.rows.length === 0) {
      throw new ApiError('Report not found', 404);
    }

    return NextResponse.json({ report: result.rows[0] }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Unauthorized', 401);
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);

    const body = await request.json();
    const { pet_name, breed, color, description, location_lat, location_lon, status } = body;

    const result = await db.query(
      `UPDATE reports 
       SET pet_name = COALESCE($1, pet_name),
           breed = COALESCE($2, breed),
           color = COALESCE($3, color),
           description = COALESCE($4, description),
           location_lat = COALESCE($5, location_lat),
           location_lon = COALESCE($6, location_lon),
           status = COALESCE($7, status),
           updated_at = NOW()
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [pet_name, breed, color, description, location_lat, location_lon, status, params.id, decoded.userId]
    );

    if (result.rows.length === 0) {
      throw new ApiError('Report not found or unauthorized', 404);
    }

    return NextResponse.json({ report: result.rows[0] }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Unauthorized', 401);
    }

    const token = authHeader.slice(7);
    const decoded = verifyToken(token);

    const result = await db.query(
      'DELETE FROM reports WHERE id = $1 AND user_id = $2 RETURNING id',
      [params.id, decoded.userId]
    );

    if (result.rows.length === 0) {
      throw new ApiError('Report not found or unauthorized', 404);
    }

    return NextResponse.json({ message: 'Report deleted' }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
