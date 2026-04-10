import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const step = await db.queryOne('SELECT * FROM how_it_works_steps WHERE id = $1', [id]);

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
    const { step_number, title, description, icon_name, icon_url, is_active } = await request.json();

    const step = await db.queryOne('SELECT * FROM how_it_works_steps WHERE id = $1', [id]);
    if (!step) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }

    const result = await db.queryOne(
      `UPDATE how_it_works_steps 
       SET step_number = $1, title = $2, description = $3, icon_name = $4, 
           icon_url = $5, is_active = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [
        step_number || step.step_number,
        title || step.title,
        description || step.description,
        icon_name || step.icon_name,
        icon_url || step.icon_url,
        is_active !== undefined ? is_active : step.is_active,
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

    const step = await db.queryOne('SELECT * FROM how_it_works_steps WHERE id = $1', [id]);
    if (!step) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }

    await db.execute('DELETE FROM how_it_works_steps WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Step deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting step:', error);
    return NextResponse.json({ error: 'Failed to delete step' }, { status: 500 });
  }
}
