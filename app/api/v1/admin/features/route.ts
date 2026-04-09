import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const features = await db.queryMany(
      'SELECT * FROM features ORDER BY display_order ASC'
    );
    return NextResponse.json({ data: features }, { status: 200 });
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, icon_name, icon_url, display_order, is_active } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await db.queryOne(
      `INSERT INTO features (title, description, icon_name, icon_url, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, icon_name, icon_url, display_order || 0, is_active !== false]
    );

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 });
  }
}
