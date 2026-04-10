
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const result = await db.query('SELECT * FROM organisations WHERE user_id = $1', [user.id]);
    if (result.rows.length === 0) {
      return NextResponse.json(null);
    }
    const org = result.rows[0];
    const animalCount = await db.query('SELECT COUNT(*)::int AS count FROM organisation_animals WHERE org_id = $1', [org.id]);
    
    return NextResponse.json({
      id: org.id, 
      userId: org.user_id, 
      name: org.name, 
      type: org.type, 
      abn: org.abn,
      address: org.address, 
      phone: org.phone, 
      email: org.email, 
      website: org.website,
      latitude: org.latitude, 
      longitude: org.longitude, 
      description: org.description,
      logoUri: org.logo_uri, 
      status: org.status, 
      approvedAt: org.approved_at, 
      createdAt: org.created_at,
      animalCount: animalCount.rows[0].count,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const body = await request.json();
    const { name, type, abn, address, phone, email, website, latitude, longitude, description, logoUri } = body;

    const result = await db.query(
      `UPDATE organisations 
       SET name = COALESCE($1, name),
           type = COALESCE($2, type),
           abn = COALESCE($3, abn),
           address = COALESCE($4, address),
           phone = COALESCE($5, phone),
           email = COALESCE($6, email),
           website = COALESCE($7, website),
           latitude = COALESCE($8, latitude),
           longitude = COALESCE($9, longitude),
           description = COALESCE($10, description),
           logo_uri = COALESCE($11, logo_uri),
           updated_at = NOW()
       WHERE user_id = $12
       RETURNING *`,
      [name, type, abn, address, phone, email, website, latitude, longitude, description, logoUri, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Organisation not found" }, { status: 404 });
    }

    const org = result.rows[0];
    return NextResponse.json(org);
  } catch (error) {
    return handleApiError(error);
  }
}
