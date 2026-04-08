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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'lost' or 'found'
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = 'SELECT * FROM reports WHERE status = $1';
    const params: any[] = ['active'];

    if (type) {
      query += ' AND report_type = $2';
      params.push(type);
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit);
    params.push(offset);

    const result = await db.query(query, params);

    return NextResponse.json(
      { reports: result.rows, total: result.rows.length },
      { status: 200 }
    );
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
    const { report_type, pet_type, pet_name, breed, color, description, location_lat, location_lon, photo_url } = body;

    const result = await db.query(
      `INSERT INTO reports (user_id, report_type, pet_type, pet_name, breed, color, description, location_lat, location_lon, photo_url, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'active', NOW())
       RETURNING *`,
      [decoded.userId, report_type, pet_type, pet_name, breed, color, description, location_lat, location_lon, photo_url]
    );

    return NextResponse.json(
      { report: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
