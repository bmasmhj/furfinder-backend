
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const { reportId, title, content, howTheyReunited } = await request.json();

    const report = await db.queryOne(
      'SELECT id, user_id, pet_name, pet_type, photo_uri, pet_reunited_id, status FROM pet_reports WHERE id = $1',
      [reportId]
    );

    if (!report) {
      return NextResponse.json({ message: 'Report not found' }, { status: 404 });
    }

    if (report.user_id !== user.id) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 });
    }

    const slug = `${report.pet_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    // Link the story to the original pet report(s)
    // If this report has a pet_reunited_id, it means it was part of a claim/link.
    // We should update ALL reports sharing that pet_reunited_id.
    const sharedId = report.pet_reunited_id;
    
    let beforeImage = report.photo_uri;
    let afterImage = null;

    if (sharedId) {
       // Find the other report in this reunion
       const otherReport = await db.queryOne(
         'SELECT id, photo_uri, status FROM pet_reports WHERE pet_reunited_id = $1 AND id != $2',
         [sharedId, reportId]
       );
       if (otherReport) {
          // If we have a lost and found pair, use them as before/after
          if (report.status === 'lost') {
            beforeImage = report.photo_uri;
            afterImage = otherReport.photo_uri;
          } else {
            beforeImage = otherReport.photo_uri;
            afterImage = report.photo_uri;
          }
       }
    }

    const result = await db.queryOne(
      `INSERT INTO reunited_stories (
        slug, pet_name, pet_type, owner_name, story_title, story_content, 
        before_image_url, after_image_url, reunion_date, how_they_reunited, is_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, true)
      RETURNING id`,
      [
        slug, report.pet_name, report.pet_type, user.display_name || 'Owner',
        title, content, beforeImage, afterImage, howTheyReunited
      ]
    );

    if (sharedId) {
      await db.query(
        'UPDATE pet_reports SET pet_reunited_id = $1 WHERE pet_reunited_id = $2',
        [result.id, sharedId]
      );
    } else {
      await db.query(
        'UPDATE pet_reports SET pet_reunited_id = $1 WHERE id = $2',
        [result.id, reportId]
      );
    }

    return NextResponse.json({ success: true, storyId: result.id });
  } catch (error) {
    return handleApiError(error);
  }
}
