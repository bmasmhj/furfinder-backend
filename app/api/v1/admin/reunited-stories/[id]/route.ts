import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const story = await db.queryOne('SELECT * FROM reunited_stories WHERE id = $1', [id]);

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json({ data: story }, { status: 200 });
  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json({ error: 'Failed to fetch story' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { pet_name, pet_type, owner_name, story_title, story_content, before_image_url, after_image_url, reunion_date, featured_on_homepage } = await request.json();

    const story = await db.queryOne('SELECT * FROM reunited_stories WHERE id = $1', [id]);
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    const result = await db.queryOne(
      `UPDATE reunited_stories 
       SET pet_name = $1, pet_type = $2, owner_name = $3, story_title = $4, story_content = $5, 
           before_image_url = $6, after_image_url = $7, reunion_date = $8, featured_on_homepage = $9, updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [
        pet_name || story.pet_name,
        pet_type || story.pet_type,
        owner_name || story.owner_name,
        story_title || story.story_title,
        story_content || story.story_content,
        before_image_url || story.before_image_url,
        after_image_url || story.after_image_url,
        reunion_date || story.reunion_date,
        featured_on_homepage !== undefined ? featured_on_homepage : story.featured_on_homepage,
        id
      ]
    );

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error('Error updating story:', error);
    return NextResponse.json({ error: 'Failed to update story' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const story = await db.queryOne('SELECT * FROM reunited_stories WHERE id = $1', [id]);
    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    await db.execute('DELETE FROM reunited_stories WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Story deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 });
  }
}
