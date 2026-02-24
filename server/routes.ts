import type { Express, Request, Response } from "express";
import { createServer, type Server } from "node:http";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

interface PetReport {
  id: string;
  status: string;
  petType: string;
  petName: string;
  breed: string;
  size: string;
  color: string;
  markings: string;
  photoUri: string;
  photoUris?: string[];
  description: string;
  latitude: number;
  longitude: number;
  locationName: string;
  lastSeenDate: string;
  reward: string;
  contactName: string;
  contactPhone: string;
  createdAt: string;
  isOwner: boolean;
}

interface PetProfile {
  id: string;
  petType: string;
  petName: string;
  breed: string;
  size: string;
  color: string;
  markings: string;
  photoUris: string[];
  biometricPhotoUris?: string[];
  microchipNumber: string;
  medicalNotes: string;
  suburb: string;
  ownerName: string;
  ownerPhone: string;
  createdAt: string;
  updatedAt: string;
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const RADIUS_KM = 5;
const MAX_VISION_CANDIDATES = 15;

function getReportPhotos(report: PetReport): string[] {
  const photos: string[] = [];
  if (report.photoUris && report.photoUris.length > 0) {
    photos.push(...report.photoUris);
  } else if (report.photoUri) {
    photos.push(report.photoUri);
  }
  return photos.filter(p => p && (p.startsWith('data:') || p.startsWith('http')));
}

function getProfilePhotos(profile: PetProfile): string[] {
  return (profile.photoUris || []).filter(p => p && (p.startsWith('data:') || p.startsWith('http')));
}

function getProfileBiometricPhotos(profile: PetProfile): string[] {
  return (profile.biometricPhotoUris || []).filter(p => p && (p.startsWith('data:') || p.startsWith('http')));
}

function buildImageContent(photoUri: string): OpenAI.Chat.Completions.ChatCompletionContentPartImage {
  if (photoUri.startsWith('data:')) {
    return {
      type: "image_url",
      image_url: { url: photoUri, detail: "low" },
    };
  }
  return {
    type: "image_url",
    image_url: { url: photoUri, detail: "low" },
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/match", async (req: Request, res: Response) => {
    try {
      const { report, reports, profiles, radiusKm } = req.body as {
        report: PetReport;
        reports: PetReport[];
        profiles: PetProfile[];
        radiusKm?: number;
      };
      const searchRadius = radiusKm && radiusKm > 0 ? radiusKm : RADIUS_KM;

      if (!report) {
        return res.status(400).json({ error: "Report is required" });
      }

      const oppositeStatus = report.status === 'lost' ? 'found' : 'lost';

      const matchingReports = (reports || []).filter(r => {
        if (r.id === report.id) return false;
        if (r.status !== oppositeStatus) return false;
        if (r.petType !== report.petType) return false;
        if (r.latitude && r.longitude && report.latitude && report.longitude) {
          const dist = getDistance(report.latitude, report.longitude, r.latitude, r.longitude);
          if (dist > searchRadius) return false;
        }
        return true;
      });

      const matchingProfiles = (profiles || []).filter(p => p.petType === report.petType);

      interface Candidate {
        type: string;
        id: string;
        summary: string;
        photos: string[];
        distance?: number;
      }

      const candidates: Candidate[] = [];

      for (const r of matchingReports) {
        const dist = getDistance(report.latitude, report.longitude, r.latitude, r.longitude);
        candidates.push({
          type: 'report',
          id: r.id,
          summary: `[Report] ${r.status.toUpperCase()} ${r.petType} named "${r.petName}", breed: ${r.breed}, size: ${r.size}, color: ${r.color}, markings: "${r.markings}", location: ${r.locationName}, distance: ${dist.toFixed(1)}km, date: ${r.lastSeenDate}, description: "${r.description}"`,
          photos: getReportPhotos(r),
          distance: dist,
        });
      }

      for (const p of matchingProfiles) {
        const profilePhotos = getProfilePhotos(p);
        const biometricPhotos = getProfileBiometricPhotos(p);
        const allPhotos = [...profilePhotos, ...biometricPhotos];
        candidates.push({
          type: 'profile',
          id: p.id,
          summary: `[Registered Pet] ${p.petType} named "${p.petName}", breed: ${p.breed}, size: ${p.size}, color: ${p.color}, markings: "${p.markings}", suburb: ${p.suburb}, microchip: ${p.microchipNumber || 'none'}${biometricPhotos.length > 0 ? `, has ${biometricPhotos.length} biometric ID scan(s) (close-up nose/eyes/face)` : ''}`,
          photos: allPhotos,
        });
      }

      if (candidates.length === 0) {
        return res.json({ matches: [] });
      }

      candidates.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
      const visionCandidates = candidates.slice(0, MAX_VISION_CANDIDATES);

      const targetPhotos = getReportPhotos(report);
      const hasPhotos = targetPhotos.length > 0 || visionCandidates.some(c => c.photos.length > 0);

      const targetSummary = `${report.status.toUpperCase()} ${report.petType} named "${report.petName}", breed: ${report.breed}, size: ${report.size}, color: ${report.color}, markings: "${report.markings}", location: ${report.locationName}, date: ${report.lastSeenDate}, description: "${report.description}"`;

      const candidateList = visionCandidates.map((c, i) =>
        `${i + 1}. (${c.type}:${c.id}) ${c.summary} | Has ${c.photos.length} photo(s)`
      ).join('\n');

      const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [];

      if (hasPhotos) {
        userContent.push({
          type: "text",
          text: `TARGET PET (the pet we are trying to match):\n${targetSummary}\n\nTarget pet photo(s):`,
        });

        for (const photo of targetPhotos.slice(0, 3)) {
          userContent.push(buildImageContent(photo));
        }

        for (let i = 0; i < visionCandidates.length; i++) {
          const c = visionCandidates[i];
          if (c.photos.length > 0) {
            userContent.push({
              type: "text",
              text: `\nCANDIDATE ${i + 1} (${c.type}:${c.id}) — ${c.summary}\nCandidate ${i + 1} photo:`,
            });
            userContent.push(buildImageContent(c.photos[0]));
          } else {
            userContent.push({
              type: "text",
              text: `\nCANDIDATE ${i + 1} (${c.type}:${c.id}) — ${c.summary}\n(No photo available)`,
            });
          }
        }
      } else {
        userContent.push({
          type: "text",
          text: `Target pet:\n${targetSummary}\n\nCandidates:\n${candidateList}`,
        });
      }

      const systemPrompt = hasPhotos
        ? `You are an expert AI pet identification system. You analyse BOTH photos and text descriptions to match lost and found pets.

VISUAL ANALYSIS (most important when photos are available):
- Compare physical features: face shape, ear shape/position, coat pattern, markings, body build
- Look for unique identifiers: spots, patches, scars, collar, eye color
- Assess breed consistency from visual appearance
- Note any distinctive features visible in photos
- BIOMETRIC ID SCANS: Some profiles include close-up photos of nose prints, eye patterns, and facial features. These are extremely high-value for matching — nose print patterns and iris details are unique to each animal. Prioritize comparing biometric close-ups when available.

TEXT ANALYSIS:
- Breed similarity (exact match is strongest)
- Color and markings described
- Size match
- Geographic proximity (distance in km — closer is better, within ${searchRadius}km radius)
- Description details overlap

SCORING GUIDE:
- 80-100: Photos show very likely the same animal + text details match well
- 60-79: Photos show similar-looking animal + most text details align
- 40-59: Some visual resemblance or strong text match but limited photo evidence
- 30-39: Possible but uncertain match
- Below 30: Unlikely match, do not include

Return a JSON object with "matches" array sorted by confidence (highest first). Each match:
- "id": the candidate's id
- "type": "report" or "profile"
- "confidence": 0-100
- "reason": 2-3 sentence explanation mentioning BOTH visual and text similarities/differences

Only include candidates with confidence >= 30. Return at most 10 matches.
Return ONLY valid JSON, no markdown formatting.`
        : `You are an AI assistant that matches lost and found pet reports. Given a target pet report and a list of candidates, analyze each candidate and determine how likely it is to be the same pet.

Consider these factors:
- Breed similarity (exact match is strongest signal)
- Color and markings similarity
- Size match
- Geographic proximity (closer is better, candidates are within ${searchRadius}km radius)
- Date proximity (for reports)
- Description details

Return a JSON object with "matches" array sorted by confidence (highest first). Each match:
- "id": the candidate's id
- "type": "report" or "profile"
- "confidence": 0-100
- "reason": 1-2 sentence explanation

Only include candidates with confidence >= 30. Return at most 10 matches.
Return ONLY valid JSON, no markdown formatting.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 8192,
      });

      const content = completion.choices[0]?.message?.content || '{"matches":[]}';
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch {
        parsed = { matches: [] };
      }

      const matches = (parsed.matches || parsed.results || [])
        .filter((m: any) => m.confidence >= 30)
        .sort((a: any, b: any) => b.confidence - a.confidence)
        .slice(0, 10);

      return res.json({ matches });
    } catch (error) {
      console.error("Match error:", error);
      return res.status(500).json({ error: "Failed to find matches" });
    }
  });

  app.post("/api/scan-post", async (req: Request, res: Response) => {
    try {
      const { postText, url, reports, profiles } = req.body as {
        postText?: string;
        url?: string;
        reports: PetReport[];
        profiles: PetProfile[];
      };

      if (!postText && !url) {
        return res.status(400).json({ error: "Post text or URL is required" });
      }

      let contentToAnalyze = postText || '';

      if (url && !postText) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10000);
          const response = await fetch(url, {
            signal: controller.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; PetReunite/1.0)',
            },
          });
          clearTimeout(timeout);
          const html = await response.text();
          contentToAnalyze = html
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 5000);
        } catch (fetchErr) {
          if (!postText) {
            return res.status(400).json({
              error: "Could not fetch that URL. Try copying and pasting the post text instead."
            });
          }
        }
      }

      if (!contentToAnalyze.trim()) {
        return res.status(400).json({ error: "No content to analyze" });
      }

      const extractionResult = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: `You are an AI that extracts pet information from social media posts (Facebook, Instagram, Nextdoor, community boards, etc.) about lost or found pets.

Extract the following details from the post text. If a detail is not mentioned, use "unknown".

Return a JSON object with:
- "isRelevant": boolean - true if this appears to be about a lost or found pet, false otherwise
- "status": "lost" or "found" 
- "petType": one of "dog", "cat", "bird", "rabbit", "other"
- "petName": the pet's name if mentioned
- "breed": breed if mentioned
- "size": "small", "medium", or "large"
- "color": color/coloring description
- "markings": distinguishing markings
- "description": a cleaned up summary of the pet description from the post
- "locationName": location/area mentioned in the post
- "contactInfo": any contact info (phone, email) from the post
- "reward": reward amount if mentioned
- "postSummary": a 1-2 sentence summary of the post

Return ONLY valid JSON, no markdown.`
          },
          {
            role: "user",
            content: contentToAnalyze
          }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 8192,
      });

      const extractedContent = extractionResult.choices[0]?.message?.content || '{}';
      let extracted;
      try {
        extracted = JSON.parse(extractedContent);
      } catch {
        return res.status(500).json({ error: "Could not parse the post content" });
      }

      if (!extracted.isRelevant) {
        return res.json({
          extracted,
          matches: [],
          message: "This doesn't appear to be about a lost or found pet."
        });
      }

      interface ScanCandidate {
        type: string;
        id: string;
        summary: string;
        photos: string[];
      }

      const allCandidates: ScanCandidate[] = [];

      const filteredReports = (reports || []).filter(r => {
        if (extracted.petType !== 'unknown' && r.petType !== extracted.petType) return false;
        if (extracted.status === 'lost') return r.status === 'found';
        if (extracted.status === 'found') return r.status === 'lost';
        return true;
      });

      for (const r of filteredReports) {
        allCandidates.push({
          type: 'report',
          id: r.id,
          summary: `[App Report] ${r.status.toUpperCase()} ${r.petType} named "${r.petName}", breed: ${r.breed}, size: ${r.size}, color: ${r.color}, markings: "${r.markings}", location: ${r.locationName}, date: ${r.lastSeenDate}, description: "${r.description}"`,
          photos: getReportPhotos(r),
        });
      }

      const filteredProfiles = (profiles || []).filter(p => {
        if (extracted.petType !== 'unknown' && p.petType !== extracted.petType) return false;
        return true;
      });

      for (const p of filteredProfiles) {
        const profilePhotos = getProfilePhotos(p);
        const biometricPhotos = getProfileBiometricPhotos(p);
        allCandidates.push({
          type: 'profile',
          id: p.id,
          summary: `[Registered Pet] ${p.petType} named "${p.petName}", breed: ${p.breed}, size: ${p.size}, color: ${p.color}, markings: "${p.markings}", suburb: ${p.suburb}, microchip: ${p.microchipNumber || 'none'}${biometricPhotos.length > 0 ? `, has ${biometricPhotos.length} biometric ID scan(s)` : ''}`,
          photos: [...profilePhotos, ...biometricPhotos],
        });
      }

      if (allCandidates.length === 0) {
        return res.json({ extracted, matches: [] });
      }

      const scanCandidates = allCandidates.slice(0, MAX_VISION_CANDIDATES);
      const hasPhotos = scanCandidates.some(c => c.photos.length > 0);

      const postSummary = `${extracted.status?.toUpperCase() || 'UNKNOWN'} ${extracted.petType || 'pet'} named "${extracted.petName || 'unknown'}", breed: ${extracted.breed || 'unknown'}, size: ${extracted.size || 'unknown'}, color: ${extracted.color || 'unknown'}, markings: "${extracted.markings || 'none'}", location: ${extracted.locationName || 'unknown'}, description: "${extracted.description || ''}"`;

      const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [];

      if (hasPhotos) {
        userContent.push({
          type: "text",
          text: `PET FROM ONLINE POST:\n${postSummary}\n\nAPP DATABASE CANDIDATES WITH PHOTOS:`,
        });

        for (let i = 0; i < scanCandidates.length; i++) {
          const c = scanCandidates[i];
          if (c.photos.length > 0) {
            userContent.push({
              type: "text",
              text: `\nCANDIDATE ${i + 1} (${c.type}:${c.id}) — ${c.summary}\nPhoto:`,
            });
            userContent.push(buildImageContent(c.photos[0]));
          } else {
            userContent.push({
              type: "text",
              text: `\nCANDIDATE ${i + 1} (${c.type}:${c.id}) — ${c.summary}\n(No photo)`,
            });
          }
        }
      } else {
        const candidateList = scanCandidates.map((c, i) =>
          `${i + 1}. (${c.type}:${c.id}) ${c.summary}`
        ).join('\n');

        userContent.push({
          type: "text",
          text: `Online post pet info:\n${postSummary}\n\nApp database candidates:\n${candidateList}`,
        });
      }

      const scanSystemPrompt = hasPhotos
        ? `You are an expert AI pet identification system. Match pets from online social media posts with existing reports and registered profiles in a lost & found app.

When photos are available, use VISUAL ANALYSIS as the primary matching method:
- Compare coat patterns, markings, face shape, ear position, body build
- Look for unique identifiers visible in photos
- Cross-reference visual assessment with text descriptions

Also consider text factors:
- Breed, color, markings similarity
- Size match
- Geographic proximity
- Description overlap

Return a JSON object with "matches" array sorted by confidence (highest first). Each match:
- "id": candidate id
- "type": "report" or "profile"
- "confidence": 0-100
- "reason": 2-3 sentence explanation

Only include candidates with confidence >= 25. Return at most 10.
Return ONLY valid JSON, no markdown.`
        : `You are an AI that matches pets from online social media posts with existing pet reports and registered profiles.

Consider these factors:
- Breed similarity (exact match is strongest)
- Color and markings similarity
- Size match
- Geographic proximity based on location names
- Description details overlap

Return a JSON object with "matches" array sorted by confidence (highest first). Each match:
- "id": candidate id
- "type": "report" or "profile"
- "confidence": 0-100
- "reason": 1-2 sentence explanation

Only include candidates with confidence >= 25. Return at most 10.
Return ONLY valid JSON, no markdown.`;

      const matchResult = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system", content: scanSystemPrompt },
          { role: "user", content: userContent },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 8192,
      });

      const matchContent = matchResult.choices[0]?.message?.content || '{"matches":[]}';
      let matchParsed;
      try {
        matchParsed = JSON.parse(matchContent);
      } catch {
        matchParsed = { matches: [] };
      }

      const matches = (matchParsed.matches || matchParsed.results || [])
        .filter((m: any) => m.confidence >= 25)
        .sort((a: any, b: any) => b.confidence - a.confidence)
        .slice(0, 10);

      return res.json({ extracted, matches });
    } catch (error) {
      console.error("Scan post error:", error);
      return res.status(500).json({ error: "Failed to analyze the post" });
    }
  });

  app.post("/api/quick-snap-match", async (req: Request, res: Response) => {
    try {
      const { photoUri, petType, reports, profiles } = req.body as {
        photoUri: string;
        petType?: string;
        reports: PetReport[];
        profiles: PetProfile[];
      };

      if (!photoUri) {
        return res.status(400).json({ error: "A photo is required" });
      }

      const validPhoto = photoUri.startsWith('data:') || photoUri.startsWith('http');
      if (!validPhoto) {
        return res.status(400).json({ error: "Invalid photo format" });
      }

      const lostReports = (reports || []).filter(r => {
        if (r.status !== 'lost') return false;
        if (petType && r.petType !== petType) return false;
        return true;
      });

      const allProfiles = (profiles || []).filter(p => {
        if (petType && p.petType !== petType) return false;
        return true;
      });

      interface SnapCandidate {
        type: string;
        id: string;
        summary: string;
        photos: string[];
      }

      const candidates: SnapCandidate[] = [];

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
          summary: `[Registered Pet] ${p.petType} named "${p.petName}", breed: ${p.breed}, size: ${p.size}, color: ${p.color}, markings: "${p.markings}", suburb: ${p.suburb}, owner: ${p.ownerName}${biometricPhotos.length > 0 ? `, has ${biometricPhotos.length} biometric ID scan(s) (close-up nose/eyes/face)` : ''}`,
          photos: [...profilePhotos, ...biometricPhotos],
        });
      }

      if (candidates.length === 0) {
        return res.json({ matches: [] });
      }

      const visionCandidates = candidates.slice(0, MAX_VISION_CANDIDATES);

      const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [];

      userContent.push({
        type: "text",
        text: `QUICK SNAP PHOTO — A photo taken by someone who spotted a pet and wants to identify it:\n`,
      });
      userContent.push(buildImageContent(photoUri));

      for (let i = 0; i < visionCandidates.length; i++) {
        const c = visionCandidates[i];
        if (c.photos.length > 0) {
          userContent.push({
            type: "text",
            text: `\nCANDIDATE ${i + 1} (${c.type}:${c.id}) — ${c.summary}\nCandidate photo(s):`,
          });
          for (const photo of c.photos.slice(0, 3)) {
            userContent.push(buildImageContent(photo));
          }
        } else {
          userContent.push({
            type: "text",
            text: `\nCANDIDATE ${i + 1} (${c.type}:${c.id}) — ${c.summary}\n(No photo available)`,
          });
        }
      }

      const snapSystemPrompt = `You are an expert AI pet identification system specializing in visual biometric matching. A person has spotted a pet and taken a quick photo. Your job is to identify if this pet matches any lost pet reports or registered pet profiles.

VISUAL BIOMETRIC ANALYSIS (highest priority):
- Compare the snapped photo against ALL candidate photos, especially biometric ID scans
- NOSE PRINT MATCHING: Compare nose texture patterns, nostril shape, bridge width — these are unique like fingerprints
- EYE MATCHING: Compare iris color, eye shape, eye spacing, pupil characteristics
- FACIAL STRUCTURE: Compare head shape, ear position/shape, muzzle length, forehead markings
- COAT MATCHING: Compare coat color patterns, spot locations, stripe patterns, patches
- Look for unique identifiers: scars, markings, collar details, ear notches

TEXT COMPARISON (secondary):
- Breed consistency
- Color and size match
- Markings described

SCORING:
- 80-100: Strong visual match — biometric features align (nose pattern, eye color, facial structure match)
- 60-79: Good visual similarity — multiple features match but some uncertainty
- 40-59: Moderate resemblance — same breed/color but limited distinguishing match
- 30-39: Possible but uncertain
- Below 30: Do not include

Return a JSON object with "matches" array sorted by confidence (highest first). Each match:
- "id": candidate id
- "type": "report" or "profile"
- "confidence": 0-100
- "reason": 2-3 sentence explanation focusing on VISUAL similarities found, mentioning specific biometric features compared

Only include confidence >= 30. Return at most 10 matches.
Return ONLY valid JSON, no markdown.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system", content: snapSystemPrompt },
          { role: "user", content: userContent },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 8192,
      });

      const content = completion.choices[0]?.message?.content || '{"matches":[]}';
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch {
        parsed = { matches: [] };
      }

      const matches = (parsed.matches || parsed.results || [])
        .filter((m: any) => m.confidence >= 30)
        .sort((a: any, b: any) => b.confidence - a.confidence)
        .slice(0, 10);

      return res.json({ matches });
    } catch (error) {
      console.error("Quick snap match error:", error);
      return res.status(500).json({ error: "Failed to process snap match" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
