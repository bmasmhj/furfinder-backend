
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { handleApiError } from '@/lib/api-errors';

export async function GET(request: NextRequest) {
  try {
    const result = await db.query(
      `SELECT o.*, COUNT(oa.id)::int AS animal_count
       FROM organisations o
       LEFT JOIN organisation_animals oa ON oa.org_id = o.id AND oa.status = 'available'
       WHERE o.status = 'approved'
       GROUP BY o.id
       ORDER BY o.name`
    );
    
    return NextResponse.json(result.rows.map((o: any) => ({
      id: o.id, 
      userId: o.user_id, 
      name: o.name, 
      type: o.type, 
      abn: o.abn,
      address: o.address, 
      phone: o.phone, 
      email: o.email, 
      website: o.website,
      latitude: o.latitude, 
      longitude: o.longitude, 
      description: o.description,
      logoUri: o.logo_uri, 
      status: o.status, 
      approvedAt: o.approved_at, 
      createdAt: o.created_at,
      animalCount: o.animal_count,
    })));
  } catch (error) {
    return handleApiError(error);
  }
}
