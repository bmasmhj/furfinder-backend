
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const result = await db.query(
      `SELECT c.*, 
              u1.display_name as "participant1Name",
              u2.display_name as "participant2Name",
              u1.id as "user1Id",
              u2.id as "user2Id"
       FROM conversations c
       JOIN users u1 ON c.participant1_id = u1.id
       JOIN users u2 ON c.participant2_id = u2.id
       WHERE c.participant1_id = $1 OR c.participant2_id = $1
       ORDER BY c.last_message_at DESC`,
      [user.id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const body = await request.json();
    const { participant2Id, reportId } = body;

    if (!participant2Id) return NextResponse.json({ message: 'Participant 2 ID is required' }, { status: 400 });

    // Ensure participant1_id is always the smaller one to maintain UNIQUE constraint if needed, 
    // but original server seems to just use whatever.
    // Actually, original UNIQUE is (report_id, participant1_id, participant2_id).
    
    const [p1, p2] = [user.id, participant2Id].sort();

    const existing = await db.query(
      'SELECT * FROM conversations WHERE report_id = $1 AND participant1_id = $2 AND participant2_id = $3',
      [reportId || null, p1, p2]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(existing.rows[0]);
    }

    const result = await db.query(
      `INSERT INTO conversations (id, report_id, participant1_id, participant2_id, last_message_at, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
       RETURNING *`,
      [reportId || null, p1, p2]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
