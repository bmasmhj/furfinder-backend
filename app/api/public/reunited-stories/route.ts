import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = 'SELECT * FROM reunited_stories WHERE is_published = true';
    const params: any[] = [];

    if (featured === 'true') {
      query += ' AND featured_on_homepage = true';
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countResult = await db.queryOne(countQuery, params);
    const total = (countResult as any)?.total || 0;

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const stories = await db.queryMany(query, params);

    return NextResponse.json({
      data: stories,
      pagination: {
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reunited stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reunited stories' },
      { status: 500 }
    );
  }
}
