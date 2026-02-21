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

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/match", async (req: Request, res: Response) => {
    try {
      const { report, reports, profiles } = req.body as {
        report: PetReport;
        reports: PetReport[];
        profiles: PetProfile[];
      };

      if (!report) {
        return res.status(400).json({ error: "Report is required" });
      }

      const candidates: { type: string; id: string; summary: string }[] = [];

      const oppositeStatus = report.status === 'lost' ? 'found' : 'lost';
      const matchingReports = (reports || []).filter(
        r => r.id !== report.id && r.status === oppositeStatus && r.petType === report.petType
      );

      for (const r of matchingReports) {
        const dist = getDistance(report.latitude, report.longitude, r.latitude, r.longitude);
        candidates.push({
          type: 'report',
          id: r.id,
          summary: `[Report] ${r.status.toUpperCase()} ${r.petType} named "${r.petName}", breed: ${r.breed}, size: ${r.size}, color: ${r.color}, markings: "${r.markings}", location: ${r.locationName}, distance: ${dist.toFixed(1)}km away, date: ${r.lastSeenDate}, description: "${r.description}"`,
        });
      }

      const matchingProfiles = (profiles || []).filter(
        p => p.petType === report.petType
      );

      for (const p of matchingProfiles) {
        candidates.push({
          type: 'profile',
          id: p.id,
          summary: `[Registered Pet] ${p.petType} named "${p.petName}", breed: ${p.breed}, size: ${p.size}, color: ${p.color}, markings: "${p.markings}", suburb: ${p.suburb}, microchip: ${p.microchipNumber || 'none'}`,
        });
      }

      if (candidates.length === 0) {
        return res.json({ matches: [] });
      }

      const targetSummary = `${report.status.toUpperCase()} ${report.petType} named "${report.petName}", breed: ${report.breed}, size: ${report.size}, color: ${report.color}, markings: "${report.markings}", location: ${report.locationName}, date: ${report.lastSeenDate}, description: "${report.description}"`;

      const candidateList = candidates.map((c, i) => `${i + 1}. (${c.type}:${c.id}) ${c.summary}`).join('\n');

      const completion = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant that matches lost and found pet reports. Given a target pet report and a list of candidates (other reports or registered pet profiles), analyze each candidate and determine how likely it is to be the same pet.

Consider these factors:
- Breed similarity (exact match is strongest signal)
- Color and markings similarity
- Size match
- Geographic proximity (closer is better)
- Date proximity (for reports)
- Description details

Return a JSON array of matches sorted by confidence (highest first). Each match should have:
- "id": the candidate's id
- "type": "report" or "profile"  
- "confidence": a number from 0-100
- "reason": a brief 1-2 sentence explanation of why this could be a match

Only include candidates with confidence >= 30. Return at most 10 matches.
Return ONLY valid JSON, no markdown formatting.`
          },
          {
            role: "user",
            content: `Target pet:\n${targetSummary}\n\nCandidates:\n${candidateList}`
          }
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

      const allCandidates: { type: string; id: string; summary: string }[] = [];

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
        });
      }

      const filteredProfiles = (profiles || []).filter(p => {
        if (extracted.petType !== 'unknown' && p.petType !== extracted.petType) return false;
        return true;
      });

      for (const p of filteredProfiles) {
        allCandidates.push({
          type: 'profile',
          id: p.id,
          summary: `[Registered Pet] ${p.petType} named "${p.petName}", breed: ${p.breed}, size: ${p.size}, color: ${p.color}, markings: "${p.markings}", suburb: ${p.suburb}, microchip: ${p.microchipNumber || 'none'}`,
        });
      }

      if (allCandidates.length === 0) {
        return res.json({ extracted, matches: [] });
      }

      const postSummary = `${extracted.status?.toUpperCase() || 'UNKNOWN'} ${extracted.petType || 'pet'} named "${extracted.petName || 'unknown'}", breed: ${extracted.breed || 'unknown'}, size: ${extracted.size || 'unknown'}, color: ${extracted.color || 'unknown'}, markings: "${extracted.markings || 'none'}", location: ${extracted.locationName || 'unknown'}, description: "${extracted.description || ''}"`;

      const candidateList = allCandidates.map((c, i) => `${i + 1}. (${c.type}:${c.id}) ${c.summary}`).join('\n');

      const matchResult = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: `You are an AI that matches pets from online social media posts with existing pet reports and registered profiles in a lost & found pets app.

Given extracted details from an online post and a list of candidates from the app database, determine which candidates could potentially be the same pet.

Consider these factors:
- Breed similarity (exact match is strongest signal)
- Color and markings similarity
- Size match
- Geographic proximity based on location names
- Description details overlap

Return a JSON object with "matches" array sorted by confidence (highest first). Each match:
- "id": candidate id
- "type": "report" or "profile"
- "confidence": 0-100
- "reason": 1-2 sentence explanation

Only include candidates with confidence >= 25. Return at most 10 matches.
Return ONLY valid JSON, no markdown.`
          },
          {
            role: "user",
            content: `Online post pet info:\n${postSummary}\n\nApp database candidates:\n${candidateList}`
          }
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

  const httpServer = createServer(app);
  return httpServer;
}
