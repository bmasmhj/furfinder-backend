import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    let query = 'SELECT * FROM reunited_stories WHERE is_published = true';
    const params: any[] = [];

    if (featured === 'true') {
      query += ' AND featured_on_homepage = true';
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
    const { slug, pet_name, pet_type, owner_name, story_title, story_content, before_image_url, after_image_url, reunion_date, featured_on_homepage } = await request.json();

    if (!pet_name || !pet_type || !story_title || !story_content || !owner_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const generatedSlug = slug || pet_name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

    const result = await db.queryOne(
      `INSERT INTO reunited_stories (slug, pet_name, pet_type, owner_name, story_title, story_content, before_image_url, after_image_url, reunion_date, featured_on_homepage, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [generatedSlug, pet_name, pet_type, owner_name, story_title, story_content, before_image_url, after_image_url, reunion_date, featured_on_homepage || false, true]
    );

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating reunited story:', error);
    return NextResponse.json({ error: 'Failed to create reunited story' }, { status: 500 });
  }
}
