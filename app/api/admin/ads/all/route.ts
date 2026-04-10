
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

    const settingsResult = await db.query("SELECT value FROM app_settings WHERE key = 'ads_enabled'");
    const result = await db.query(
      `SELECT a.*, u.email as "userEmail"
       FROM ads a
       JOIN users u ON a.user_id = u.id
       ORDER BY a.created_at DESC`
    );

    return NextResponse.json({ 
      ads: result.rows, 
      adsEnabled: settingsResult.rows[0]?.value !== 'false' 
    });
  } catch (error) {
    return handleApiError(error);
  }
}
