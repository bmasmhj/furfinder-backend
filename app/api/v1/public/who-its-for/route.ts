import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const items = await db.queryMany(
      'SELECT * FROM who_its_for_segments WHERE is_active = true ORDER BY display_order ASC'
    );
    return NextResponse.json({ data: items }, { status: 200 });
  } catch (error) {
    console.error('Error fetching who-its-for:', error);
    return NextResponse.json(
      { error: 'Failed to fetch who-its-for' },
      { status: 500 }
    );
  }
}
