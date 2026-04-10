
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { eventName, properties = {}, sessionId, platform } = body;

    if (!eventName || typeof eventName !== "string") {
      return NextResponse.json({ message: "eventName required" }, { status: 400 });
    }

    const safeName = eventName.slice(0, 100);
    const userId = user?.id || null;
    
    const safeProps = typeof properties === "object" && !Array.isArray(properties) ? { ...properties } : {};
    delete (safeProps as any).email;
    delete (safeProps as any).phone;
    delete (safeProps as any).password;
    delete (safeProps as any).name;

    await db.query(
      `INSERT INTO analytics_events (event_name, properties, user_id, session_id, platform)
       VALUES ($1, $2, $3, $4, $5)`,
      [safeName, JSON.stringify(safeProps), userId, sessionId || null, platform || null]
    );

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
