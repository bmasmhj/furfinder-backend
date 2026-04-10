import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const features = await db.queryMany(
      'SELECT * FROM features WHERE is_active = true ORDER BY display_order ASC'
    );
    return NextResponse.json({ data: features }, { status: 200 });
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json(
      { error: 'Failed to fetch features' },
      { status: 500 }
    );
  }
}
