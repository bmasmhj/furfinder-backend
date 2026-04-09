import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pricing = await db.queryOne('SELECT * FROM pricing_plans WHERE id = $1', [id]);

    if (!pricing) {
      return NextResponse.json({ error: 'Pricing not found' }, { status: 404 });
    }

    return NextResponse.json({ data: pricing }, { status: 200 });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description, price_aud, billing_period, features, is_popular, display_order, is_active } = await request.json();

    const pricing = await db.queryOne('SELECT * FROM pricing_plans WHERE id = $1', [id]);
    if (!pricing) {
      return NextResponse.json({ error: 'Pricing not found' }, { status: 404 });
    }

    const result = await db.queryOne(
      `UPDATE pricing_plans 
       SET name = $1, description = $2, price_aud = $3, billing_period = $4, features = $5,
           is_popular = $6, display_order = $7, is_active = $8, updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [
        name || pricing.name,
        description || pricing.description,
        price_aud || pricing.price_aud,
        billing_period || pricing.billing_period,
        features ? JSON.stringify(features) : pricing.features,
        is_popular !== undefined ? is_popular : pricing.is_popular,
        display_order !== undefined ? display_order : pricing.display_order,
        is_active !== undefined ? is_active : pricing.is_active,
        id
      ]
    );

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error('Error updating pricing:', error);
    return NextResponse.json({ error: 'Failed to update pricing' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pricing = await db.queryOne('SELECT * FROM pricing_plans WHERE id = $1', [id]);
    if (!pricing) {
      return NextResponse.json({ error: 'Pricing not found' }, { status: 404 });
    }

    await db.execute('DELETE FROM pricing_plans WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Pricing deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting pricing:', error);
    return NextResponse.json({ error: 'Failed to delete pricing' }, { status: 500 });
  }
}
