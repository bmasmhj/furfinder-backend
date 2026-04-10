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
    return NextResponse.json(
      { error: 'Failed to fetch how-it-works' },
      { status: 500 }
    );
  }
};
