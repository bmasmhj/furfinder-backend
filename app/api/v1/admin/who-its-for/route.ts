import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const items = await db.queryMany(
      'SELECT * FROM who_its_for WHERE is_published = true ORDER BY order_index ASC'
    );
    return NextResponse.json({ data: items }, { status: 200 });
  } catch (error) {
    console.error('Error fetching who-its-for:', error);
    return NextResponse.json({ error: 'Failed to fetch who-its-for' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, icon, order_index, is_published } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await db.queryOne(
      `INSERT INTO who_its_for (title, description, icon, order_index, is_published)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, icon, order_index || 0, is_published !== false]
    );

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating who-its-for:', error);
    return NextResponse.json({ error: 'Failed to create who-its-for' }, { status: 500 });
  }
}
