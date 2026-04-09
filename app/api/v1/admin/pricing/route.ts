import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const pricing = await db.queryMany(
      'SELECT * FROM pricing WHERE is_published = true ORDER BY order_index ASC'
    );
    return NextResponse.json({ data: pricing }, { status: 200 });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, price, billing_period, features, is_popular, order_index, is_published } = await request.json();

    if (!name || !price || !billing_period || !features) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await db.queryOne(
      `INSERT INTO pricing (name, description, price, billing_period, features, is_popular, order_index, is_published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, description, price, billing_period, JSON.stringify(features), is_popular || false, order_index || 0, is_published !== false]
    );

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating pricing:', error);
    return NextResponse.json({ error: 'Failed to create pricing' }, { status: 500 });
  }
}
