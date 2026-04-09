import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await db.queryOne('SELECT * FROM who_its_for WHERE id = $1', [id]);

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ data: item }, { status: 200 });
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, description, icon, order_index, is_published } = await request.json();

    const item = await db.queryOne('SELECT * FROM who_its_for WHERE id = $1', [id]);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const result = await db.queryOne(
      `UPDATE who_its_for 
       SET title = $1, description = $2, icon = $3, order_index = $4, 
           is_published = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [
        title || item.title,
        description || item.description,
        icon || item.icon,
        order_index !== undefined ? order_index : item.order_index,
        is_published !== undefined ? is_published : item.is_published,
        id
      ]
    );

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const item = await db.queryOne('SELECT * FROM who_its_for WHERE id = $1', [id]);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    await db.execute('DELETE FROM who_its_for WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
