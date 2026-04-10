import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const items = await db.queryMany(
      'SELECT * FROM who_its_for_segments ORDER BY display_order ASC'
    );
    return NextResponse.json({ data: items }, { status: 200 });
  } catch (error) {
    console.error('Error fetching who-its-for:', error);
    return NextResponse.json({ error: 'Failed to fetch who-its-for' }, { status: 500 });
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
      `INSERT INTO who_its_for_segments (title, description, icon_name, icon_url, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, icon_name, icon_url, display_order || 0, is_active !== false]
    );

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating who-its-for:', error);
    return NextResponse.json({ error: 'Failed to create who-its-for' }, { status: 500 });
  }
}
