
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { handleApiError } from '@/lib/api-errors';

export async function GET(request: NextRequest) {
  try {
    const settingsResult = await db.query("SELECT value FROM app_settings WHERE key = 'ads_enabled'");
    const adsEnabled = settingsResult.rows[0]?.value !== 'false';
    if (!adsEnabled) return NextResponse.json([]);

    const result = await db.query(
      `SELECT id, business_name as "businessName", business_type as "businessType", image_uri as "imageUri", 
              link_url as "linkUrl", description, website, placement
       FROM ads
       WHERE status = 'approved'
         AND (start_date IS NULL OR start_date <= NOW())
         AND (end_date IS NULL OR end_date > NOW())
       ORDER BY RANDOM()`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    return handleApiError(error);
  }
}
