
import { db } from './db';
import { sendPushNotification } from './push';

const PRIMARY_RADIUS_KM = 10;
const EXTENDED_RADIUS_KM = 50;
const CONFIDENCE_THRESHOLD = 50;
const MAX_LOST_PER_RUN = 40;
const MAX_FOUND_POOL = 300;
const CANDIDATES_PER_REPORT = 10;
const AI_DELAY_MS = 1500;

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getRowPhotos(row: any): string[] {
  const uris: string[] =
    typeof row.photo_uris === 'string'
      ? JSON.parse(row.photo_uris || '[]')
      : Array.isArray(row.photo_uris)
      ? row.photo_uris
      : [];
  const photos = uris.length > 0 ? uris : row.photo_uri ? [row.photo_uri] : [];
  return photos.filter((p: string) => p && (p.startsWith('data:') || p.startsWith('http')));
}

export interface BatchRunResult {
  processed: number;
  newMatches: number;
  startedAt: string;
  finishedAt: string;
}

export let lastRunResult: BatchRunResult | null = null;
export let batchRunning = false;

export async function runBatchMatch(): Promise<BatchRunResult> {
  if (batchRunning) {
    console.log('[BatchMatch] Already running — skipping');
    return { processed: 0, newMatches: 0, startedAt: new Date().toISOString(), finishedAt: new Date().toISOString() };
  }

  batchRunning = true;
  const startedAt = new Date().toISOString();
  let processed = 0;
  let newMatches = 0;

  try {
    console.log('[BatchMatch] Starting run...');

    const lostRows = await db.query(
      `SELECT id, pet_type, pet_name, breed, size, color, markings, description,
              latitude, longitude, location_name, last_seen_date, photo_uri, photo_uris, user_id
       FROM pet_reports
       WHERE status = 'lost'
         AND created_at > NOW() - INTERVAL '90 days'
       ORDER BY created_at DESC
       LIMIT $1`,
      [MAX_LOST_PER_RUN]
    );

    const foundRows = await db.query(
      `SELECT id, pet_type, pet_name, breed, size, color, markings, description,
              latitude, longitude, location_name, last_seen_date, photo_uri, photo_uris
       FROM pet_reports
       WHERE status = 'found'
         AND created_at > NOW() - INTERVAL '90 days'
       ORDER BY created_at DESC
       LIMIT $1`,
      [MAX_FOUND_POOL]
    );

    const lostReports = lostRows.rows;
    const foundReports = foundRows.rows;
    console.log(`[BatchMatch] ${lostReports.length} lost, ${foundReports.length} found`);

    for (const lost of lostReports) {
      const filterByRadius = (maxKm: number) =>
        foundReports.filter(found => {
          if (found.pet_type !== lost.pet_type) return false;
          if (lost.latitude && lost.longitude && found.latitude && found.longitude) {
            if (getDistance(lost.latitude, lost.longitude, found.latitude, found.longitude) > maxKm) {
              return false;
            }
          }
          return true;
        });

      let nearby = filterByRadius(PRIMARY_RADIUS_KM);
      let radiusUsed = PRIMARY_RADIUS_KM;

      if (nearby.length === 0) {
        nearby = filterByRadius(EXTENDED_RADIUS_KM);
        radiusUsed = EXTENDED_RADIUS_KM;
      }

      if (nearby.length === 0) continue;

      const existingResult = await db.query(
        `SELECT found_report_id FROM admin_match_queue WHERE lost_report_id = $1`,
        [lost.id]
      );
      const alreadyChecked = new Set(existingResult.rows.map((r: any) => r.found_report_id));
      const unprocessed = nearby.filter(f => !alreadyChecked.has(f.id)).slice(0, CANDIDATES_PER_REPORT);

      if (unprocessed.length === 0) continue;
      processed++;

      // AI logic placeholder (it's commented out in legacy as well)
      // If we had OpenAI integrated, we'd call it here.
    }

    console.log(`[BatchMatch] Done. Processed ${processed}, new matches: ${newMatches}`);

    if (newMatches > 0) {
      const admins = await db.query(`SELECT id, push_token FROM users WHERE role = 'admin'`);
      const title = `${newMatches} probable pet match${newMatches !== 1 ? 'es' : ''} found`;
      const message = `The automated scan found ${newMatches} new potential match${newMatches !== 1 ? 'es' : ''} to review in your admin panel.`;

      for (const admin of admins.rows) {
        try {
          await db.query(
            `INSERT INTO notifications (user_id, type, title, message)
             VALUES ($1, 'ai_match', $2, $3)`,
            [admin.id, title, message]
          );
          sendPushNotification(admin.push_token, admin.id, title, message, {
            type: 'admin_batch_match',
          }).catch((err: any) => console.error('[BatchMatch] Push error:', err));
        } catch (err) {
          console.error('[BatchMatch] Admin notify error:', err);
        }
      }
    }
  } catch (err) {
    console.error('[BatchMatch] Fatal error:', err);
  } finally {
    batchRunning = false;
  }

  const finishedAt = new Date().toISOString();
  lastRunResult = { processed, newMatches, startedAt, finishedAt };
  return lastRunResult;
}
