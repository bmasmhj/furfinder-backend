
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const result = await db.query(
      `SELECT o.*, u.email AS registrant_email, u.display_name AS registrant_name
       FROM organisations o JOIN users u ON u.id = o.user_id
       WHERE o.status = 'pending' ORDER BY o.created_at`
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
      createdAt: o.created_at,
      registrantEmail: o.registrant_email, 
      registrantName: o.registrant_name,
    })));
  } catch (error) {
    return handleApiError(error);
  }
}
