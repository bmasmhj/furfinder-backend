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

  const httpServer = createServer(app);
  return httpServer;
}
