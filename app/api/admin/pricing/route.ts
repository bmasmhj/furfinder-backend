import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const pricing = await db.queryMany(
      'SELECT * FROM pricing_plans WHERE is_active = true ORDER BY display_order ASC'
    );
    return NextResponse.json({ data: pricing }, { status: 200 });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json({ error: 'Failed to fetch pricing' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, price_aud, billing_period, features, is_popular, display_order, is_active } = await request.json();

    if (!name || !price_aud || !billing_period || !features) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await db.queryOne(
      `INSERT INTO pricing_plans (name, description, price_aud, billing_period, features, is_popular, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, description, price_aud, billing_period, JSON.stringify(features), is_popular || false, display_order || 0, is_active !== false]
    );

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating pricing:', error);
    return NextResponse.json({ error: 'Failed to create pricing' }, { status: 500 });
  }
}
