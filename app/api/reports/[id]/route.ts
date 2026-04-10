
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

function mapReportRow(row: any, isOwner: boolean, likedByMe: boolean): any {
  return {
    id: row.id,
    userId: row.user_id,
    status: row.status,
    petType: row.pet_type,
    petName: row.pet_name,
    breed: row.breed,
    size: row.size,
    color: row.color,
    markings: row.markings,
    photoUri: row.photo_uri,
    photoUris: typeof row.photo_uris === 'string' ? JSON.parse(row.photo_uris) : (row.photo_uris || []),
    description: row.description,
    latitude: row.latitude,
    longitude: row.longitude,
    locationName: row.location_name,
    lastSeenDate: row.last_seen_date,
    reward: row.reward,
    rewardPool: row.reward_pool || 0,
    contactName: row.contact_name,
    contactPhone: row.contact_phone,
    showContactPublic: row.show_contact_public ?? true,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    isOwner,
    comments: [],
    timeline: [],
    reunionMessage: row.reunion_message || undefined,
    reunionDate: row.reunion_date ? (row.reunion_date instanceof Date ? row.reunion_date.toISOString() : row.reunion_date) : undefined,
    likes: row.likes || 0,
    likedByMe,
    isBoosted: row.is_boosted || false,
    boostedAt: row.boosted_at ? (row.boosted_at instanceof Date ? row.boosted_at.toISOString() : row.boosted_at) : undefined,
    boostExpiresAt: row.boost_expires_at ? (row.boost_expires_at instanceof Date ? row.boost_expires_at.toISOString() : row.boost_expires_at) : undefined,
  };
}

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    const result = await db.query(
      `SELECT r.*,
        COALESCE((SELECT COUNT(*) FROM report_likes WHERE report_id = r.id), 0)::int AS likes
      FROM pet_reports r WHERE r.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Report not found" }, { status: 404 });
    }

    const row = result.rows[0];
    const isOwner = user ? row.user_id === user.id : false;

    let likedByMe = false;
    if (user) {
      const likeCheck = await db.query(
        'SELECT id FROM report_likes WHERE report_id = $1 AND user_id = $2',
        [id, user.id]
      );
      likedByMe = likeCheck.rows.length > 0;
    }

    const [commentsResult, timelineResult] = await Promise.all([
      db.query('SELECT * FROM comments WHERE report_id = $1 ORDER BY created_at ASC', [id]),
      db.query('SELECT * FROM timeline_events WHERE report_id = $1 ORDER BY created_at ASC', [id])
    ]);

    const report = mapReportRow(row, isOwner, likedByMe);
    report.comments = commentsResult.rows.map((c: any) => ({
      id: c.id,
      author: c.author,
      text: c.text,
      createdAt: c.created_at instanceof Date ? c.created_at.toISOString() : c.created_at,
    }));
    report.timeline = timelineResult.rows.map((t: any) => ({
      id: t.id,
      type: t.type,
      description: t.description,
      createdAt: t.created_at instanceof Date ? t.created_at.toISOString() : t.created_at,
    }));

    return NextResponse.json(report);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const existing = await db.query('SELECT user_id FROM pet_reports WHERE id = $1', [id]);
    if (existing.rows.length === 0) return NextResponse.json({ message: "Report not found" }, { status: 404 });
    if (existing.rows[0].user_id !== user.id) return NextResponse.json({ message: "Not authorized" }, { status: 403 });

    const body = await request.json();
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const updatable: Record<string, string> = {
      status: 'status', petName: 'pet_name', breed: 'breed', size: 'size',
      color: 'color', markings: 'markings', photoUri: 'photo_uri',
      description: 'description', latitude: 'latitude', longitude: 'longitude',
      locationName: 'location_name', lastSeenDate: 'last_seen_date',
      reward: 'reward', contactName: 'contact_name', contactPhone: 'contact_phone',
      showContactPublic: 'show_contact_public', reunionMessage: 'reunion_message',
    };

    for (const [key, col] of Object.entries(updatable)) {
      if (body[key] !== undefined) {
        fields.push(`${col} = $${idx}`);
        values.push(body[key]);
        idx++;
      }
    }

    if (body.photoUris !== undefined) {
      fields.push(`photo_uris = $${idx}`);
      values.push(JSON.stringify(body.photoUris));
      idx++;
    }

    if (fields.length === 0) return NextResponse.json({ message: "No fields to update" }, { status: 400 });

    values.push(id);
    const result = await db.query(
      `UPDATE pet_reports SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    return NextResponse.json(mapReportRow(result.rows[0], true, false));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const existing = await db.query('SELECT user_id FROM pet_reports WHERE id = $1', [id]);
    if (existing.rows.length === 0) return NextResponse.json({ message: "Report not found" }, { status: 404 });
    if (existing.rows[0].user_id !== user.id) return NextResponse.json({ message: "Not authorized" }, { status: 403 });

    await db.query('DELETE FROM pet_reports WHERE id = $1', [id]);
    return NextResponse.json({ message: "Report deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
