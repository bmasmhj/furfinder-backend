import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    let query = 'SELECT * FROM reunited_stories';
    const params: any[] = [];

    if (featured === 'true') {
      query += ' WHERE is_featured = true';
    }

    query += ' ORDER BY created_at DESC';

    const stories = await db.queryMany(query, params);
    return NextResponse.json({ data: stories }, { status: 200 });
  } catch (error) {
    console.error('Error fetching reunited stories:', error);
    return NextResponse.json({ error: 'Failed to fetch reunited stories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pet_name, pet_type, story_title, story_content, image_url, reunited_date, is_featured } = await request.json();

    if (!pet_name || !pet_type || !story_title || !story_content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await db.queryOne(
      `INSERT INTO reunited_stories (pet_name, pet_type, story_title, story_content, image_url, reunited_date, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [pet_name, pet_type, story_title, story_content, image_url, reunited_date, is_featured || false]
    );

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating reunited story:', error);
    return NextResponse.json({ error: 'Failed to create reunited story' }, { status: 500 });
  }
}
