import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const pricing = await db.queryMany(
      'SELECT * FROM pricing WHERE is_published = true ORDER BY order_index ASC'
    );

    return NextResponse.json({
      data: pricing.map(p => ({
        ...p,
        features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features
      }))
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}
