
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const body = await request.json();
    const { name, type, abn, address, phone, email, website, latitude, longitude, description, logoUri } = body;

    if (!name || !type || !address || !phone || !email) {
      return NextResponse.json({ message: "Name, type, address, phone, and email are required" }, { status: 400 });
    }

    if (!['vet', 'shelter', 'rescue'].includes(type)) {
      return NextResponse.json({ message: "Type must be vet, shelter, or rescue" }, { status: 400 });
    }

    const existing = await db.query('SELECT id FROM organisations WHERE user_id = $1', [user.id]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ message: "You already have a registered organisation" }, { status: 409 });
    }

    const result = await db.query(
      `INSERT INTO organisations (user_id, name, type, abn, address, phone, email, website, latitude, longitude, description, logo_uri)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [user.id, name, type, abn || null, address, phone, email, website || null, latitude || 0, longitude || 0, description || null, logoUri || null]
    );

    await db.query("UPDATE users SET role = 'org' WHERE id = $1", [user.id]);

    const org = result.rows[0];
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
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
