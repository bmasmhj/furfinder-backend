
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

const MAX_VISION_CANDIDATES = 15;

function getReportPhotos(report: any): string[] {
  const photos = [];
  if (report.photoUris && Array.isArray(report.photoUris)) {
    photos.push(...report.photoUris);
  } else if (report.photoUri) {
    photos.push(report.photoUri);
  }
  return photos.filter(p => p && (p.startsWith('data:') || p.startsWith('http')));
}

function getProfilePhotos(profile: any): string[] {
  const uris = typeof profile.photo_uris === 'string' ? JSON.parse(profile.photo_uris) : (profile.photo_uris || []);
  return uris.filter((p: string) => p && (p.startsWith('data:') || p.startsWith('http')));
}

function getProfileBiometricPhotos(profile: any): string[] {
  const uris = typeof profile.biometric_photo_uris === 'string' ? JSON.parse(profile.biometric_photo_uris) : (profile.biometric_photo_uris || []);
  return uris.filter((p: string) => p && (p.startsWith('data:') || p.startsWith('http')));
}

async function getOrgAnimalCandidates(petType: string) {
  const sql = `
    SELECT oa.*, o.name as org_name, o.type as org_type, o.latitude as org_latitude, o.longitude as org_longitude
    FROM organisation_animals oa
    JOIN organisations o ON o.id = oa.org_id
    WHERE oa.pet_type = $1 AND oa.status = 'available'
    ORDER BY oa.created_at DESC
    LIMIT 50
  `;
  const res = await db.query(sql, [petType]);
  return res.rows;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const { photoUri, petType, reports, profiles } = body;

    if (!photoUri) {
      return NextResponse.json({ error: "A photo is required" }, { status: 400 });
    }

    const validPhoto = photoUri.startsWith('data:') || photoUri.startsWith('http');
    if (!validPhoto) {
      return NextResponse.json({ error: "Invalid photo format" }, { status: 400 });
    }

    const lostReports = (reports || []).filter((r: any) => {
      if (r.status !== 'lost') return false;
      if (petType && r.petType !== petType) return false;
      return true;
    });

    const allProfiles = (profiles || []).filter((p: any) => {
      if (petType && p.petType !== petType) return false;
      return true;
    });

    const candidates: any[] = [];

    for (const r of lostReports) {
      candidates.push({
        type: 'report',
        id: r.id,
        summary: `[Lost Report] ${r.petType} named "${r.petName}", breed: ${r.breed}, size: ${r.size}, color: ${r.color}, markings: "${r.markings}", location: ${r.locationName}, date: ${r.lastSeenDate}`,
        photos: getReportPhotos(r),
      });
    }

    for (const p of allProfiles) {
      const profilePhotos = getProfilePhotos(p);
      const biometricPhotos = getProfileBiometricPhotos(p);
      candidates.push({
        type: 'profile',
        id: p.id,
        summary: `[Registered Pet] ${p.petType} named "${p.petName}", breed: ${p.breed}, size: ${p.size}, color: ${p.color}, markings: "${p.markings}", suburb: ${p.suburb}, owner: ${p.ownerName}${biometricPhotos.length > 0 ? `, has ${biometricPhotos.length} biometric ID scan(s)` : ''}`,
        photos: [...profilePhotos, ...biometricPhotos],
      });
    }

    const orgAnimals = await getOrgAnimalCandidates(petType || 'dog');
    for (const oa of orgAnimals) {
      const photos = Array.isArray(oa.photo_uris) ? oa.photo_uris : (typeof oa.photo_uris === 'string' ? JSON.parse(oa.photo_uris) : []);
      const orgLabel = oa.org_type === 'vet' ? 'Vet Clinic' : oa.org_type === 'rescue' ? 'Rescue Group' : 'Shelter';
      candidates.push({
        type: 'org_animal',
        id: oa.id,
        summary: `[${orgLabel}: ${oa.org_name}] ${oa.pet_type} named "${oa.pet_name}", breed: ${oa.breed}, size: ${oa.size}, color: ${oa.color}, markings: "${oa.markings}", intake: ${oa.intake_type}, microchip: ${oa.microchip_number || 'none'}, description: "${oa.description}"`,
        photos: photos.slice(0, 3),
      });
    }

    // AI analysis is bypassed as per legacy status, returning gathered candidates.
    return NextResponse.json({ 
      matches: candidates.slice(0, MAX_VISION_CANDIDATES).map(c => ({
        id: c.id,
        type: c.type,
        confidence: 50,
        reason: "Visual candidate based on pet type and report category",
        details: c.summary
      }))
    });
  } catch (error) {
    return handleApiError(error);
  }
}
