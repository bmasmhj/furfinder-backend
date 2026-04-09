import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const feature = await db.queryOne('SELECT * FROM features WHERE id = $1', [id]);

    if (!feature) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }

    return NextResponse.json({ data: feature }, { status: 200 });
  } catch (error) {
    console.error('Error fetching feature:', error);
    return NextResponse.json({ error: 'Failed to fetch feature' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, description, icon_name, icon_url, display_order, is_active } = await request.json();

    const feature = await db.queryOne('SELECT * FROM features WHERE id = $1', [id]);
    if (!feature) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }

    const result = await db.queryOne(
      `UPDATE features 
       SET title = $1, description = $2, icon_name = $3, icon_url = $4, 
           display_order = $5, is_active = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [
        title || feature.title,
        description || feature.description,
        icon_name || feature.icon_name,
        icon_url || feature.icon_url,
        display_order !== undefined ? display_order : feature.display_order,
        is_active !== undefined ? is_active : feature.is_active,
        id
      ]
    );

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error('Error updating feature:', error);
    return NextResponse.json({ error: 'Failed to update feature' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const feature = await db.queryOne('SELECT * FROM features WHERE id = $1', [id]);
    if (!feature) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }

    await db.execute('DELETE FROM features WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Feature deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting feature:', error);
    return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 });
  }
}
