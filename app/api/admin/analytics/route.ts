
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

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const summaryResult = await db.query(
      `SELECT event_name, COUNT(*) AS total, COUNT(DISTINCT user_id) AS unique_users
       FROM analytics_events
       WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL
       GROUP BY event_name
       ORDER BY total DESC`,
      [days]
    );

    const dailyResult = await db.query(
      `SELECT DATE(created_at) AS day, COUNT(*) AS events, COUNT(DISTINCT user_id) AS users
       FROM analytics_events
       WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL
       GROUP BY DATE(created_at)
       ORDER BY day DESC`,
      [days]
    );

    return NextResponse.json({ 
      summary: summaryResult.rows, 
      daily: dailyResult.rows, 
      days 
    });
  } catch (error) {
    return handleApiError(error);
  }
}
