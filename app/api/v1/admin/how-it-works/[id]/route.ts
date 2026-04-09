import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const step = await db.queryOne('SELECT * FROM how_it_works WHERE id = $1', [id]);

    if (!step) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }

    return NextResponse.json({ data: step }, { status: 200 });
  } catch (error) {
    console.error('Error fetching step:', error);
    return NextResponse.json({ error: 'Failed to fetch step' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { step_number, title, description, image_url, order_index, is_published } = await request.json();

    const step = await db.queryOne('SELECT * FROM how_it_works WHERE id = $1', [id]);
    if (!step) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }

    const result = await db.queryOne(
      `UPDATE how_it_works 
       SET step_number = $1, title = $2, description = $3, image_url = $4, 
           order_index = $5, is_published = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [
        step_number || step.step_number,
        title || step.title,
        description || step.description,
        image_url || step.image_url,
        order_index !== undefined ? order_index : step.order_index,
        is_published !== undefined ? is_published : step.is_published,
        id
      ]
    );

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error('Error updating step:', error);
    return NextResponse.json({ error: 'Failed to update step' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const step = await db.queryOne('SELECT * FROM how_it_works WHERE id = $1', [id]);
    if (!step) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }

    await db.execute('DELETE FROM how_it_works WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Step deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting step:', error);
    return NextResponse.json({ error: 'Failed to delete step' }, { status: 500 });
  }
}
