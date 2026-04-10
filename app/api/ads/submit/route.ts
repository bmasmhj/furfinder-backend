
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const body = await request.json();
    const { 
      businessName, businessType, contactName, contactEmail, 
      contactPhone, website, imageUri, linkUrl, description, placement 
    } = body;

    if (!businessName || !imageUri) {
      return NextResponse.json({ message: "Business name and ad image are required" }, { status: 400 });
    }

    const result = await db.query(
      `INSERT INTO ads (user_id, business_name, business_type, contact_name, contact_email, contact_phone, website, image_uri, link_url, description, placement)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        user.id, businessName, businessType || 'other', contactName || '', 
        contactEmail || '', contactPhone || '', website || '', imageUri, 
        linkUrl || '', description || '', placement || 'feed'
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
