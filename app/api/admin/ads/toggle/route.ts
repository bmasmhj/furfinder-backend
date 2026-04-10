
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { enabled } = await request.json();
    const value = enabled ? 'true' : 'false';

    await db.query(
      "INSERT INTO app_settings (key, value, updated_at) VALUES ('ads_enabled', $1, NOW()) ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()",
      [value]
    );

    return NextResponse.json({ success: true, enabled });
  } catch (error) {
    return handleApiError(error);
  }
}
