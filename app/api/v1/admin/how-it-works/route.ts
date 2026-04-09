import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const steps = await db.queryMany(
      'SELECT * FROM how_it_works_steps WHERE is_active = true ORDER BY step_number ASC'
    );
    return NextResponse.json({ data: steps }, { status: 200 });
  } catch (error) {
    console.error('Error fetching how-it-works:', error);
    return NextResponse.json({ error: 'Failed to fetch how-it-works' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { step_number, title, description, icon_name, icon_url, is_active } = await request.json();

    if (!step_number || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await db.queryOne(
      `INSERT INTO how_it_works_steps (step_number, title, description, icon_name, icon_url, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [step_number, title, description, icon_name, icon_url, is_active !== false]
    );

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating how-it-works:', error);
    return NextResponse.json({ error: 'Failed to create how-it-works' }, { status: 500 });
  }
}
