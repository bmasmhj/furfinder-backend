
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { handleApiError } from '@/lib/api-errors';

export async function GET(request: NextRequest) {
  try {
    const result = await db.query(
      `SELECT suburb, COUNT(*)::int AS count, 
       array_agg(DISTINCT pet_type) AS pet_types
       FROM pet_profiles 
       WHERE suburb IS NOT NULL AND suburb != ''
       GROUP BY suburb 
       ORDER BY count DESC, suburb ASC`
    );
    
    return NextResponse.json(result.rows.map((r: any) => ({
      suburb: r.suburb,
      count: r.count,
      petTypes: r.pet_types || [],
    })));
  } catch (error) {
    return handleApiError(error);
  }
}
