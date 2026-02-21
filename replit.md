# PetReunite - Lost & Found Pets App

## Overview
A comprehensive lost and found pets mobile app built with Expo + React Native (frontend) and Express + TypeScript (backend). Users can browse/report lost/found pets, view them on a map, proactively register their own pets, and manage everything from a unified "My Pets" tab.

## Architecture
- **Frontend**: Expo Router (file-based routing), React Native, React Query
- **Backend**: Express + TypeScript on port 5000
- **State**: React Context with AsyncStorage persistence (pet-context.tsx)
- **Styling**: Coral (#FF6B4A) + Teal (#2CBCB6) color scheme, Poppins font family

## Key Features
1. Home feed with lost/found pet cards
2. Interactive map view (platform-specific: react-native-maps on mobile, web fallback)
3. Report lost/found pets with photo upload + GPS location
4. **Pet Profile Registration**: Owners can pre-register pets with photos, microchip number, breed, suburb, medical notes
5. Quick "Report as Lost" from registered pet profiles (pre-fills report form)
6. Combined "My Pets" tab with sub-tabs for registered pets and active reports
7. **AI Matching**: Uses OpenAI (via Replit AI Integrations) to find potential matches between lost/found reports and registered profiles based on breed, color, markings, size, location, and descriptions

## Project Structure
- `app/(tabs)/` - Tab screens: index (home), map, report, my-reports (renamed to "My Pets")
- `app/report-form.tsx` - Lost/found report form (supports pre-fill from profile via `fromProfileId` param)
- `app/register-pet.tsx` - Pet registration/edit form (supports edit via `editId` param)
- `app/my-pet/[id].tsx` - Registered pet detail view
- `app/pet/[id].tsx` - Pet report detail view (includes "Find AI Matches" button)
- `app/matches.tsx` - AI matches results screen
- `lib/pet-context.tsx` - State management for reports + profiles
- `lib/types.ts` - TypeScript types (PetReport, PetProfile, PetMatch)
- `lib/helpers.ts` - Utility functions
- `lib/query-client.ts` - API client with getApiUrl(), apiRequest()
- `constants/colors.ts` - App color constants
- `components/` - Shared components (MapViewNative, EmptyState, ErrorBoundary)
- `server/routes.ts` - Backend API routes (POST /api/match for AI matching)
- `server/replit_integrations/` - OpenAI AI Integrations (chat, image, audio, batch modules)

## Data Types
- **PetReport**: Lost/found reports with status, location, contact info
- **PetProfile**: Registered pet profiles with photoUris[], microchipNumber, suburb, medicalNotes, owner details
- **PetMatch**: AI match result with id, type (report/profile), confidence (0-100), reason

## AI Integration
- Uses Replit AI Integrations for OpenAI access (no separate API key needed, billed to credits)
- Model: gpt-5.2 for matching analysis
- Endpoint: POST /api/match - accepts target report + all reports/profiles, returns ranked matches with confidence scores
- Pre-filters candidates by pet type and opposite status before sending to AI

## Recent Changes
- 2026-02-21: Added AI-powered matching feature with OpenAI integration
- 2026-02-21: Added matches screen with confidence scores and AI reasoning
- 2026-02-21: Added "Find AI Matches" button on pet report detail screen
- 2026-02-21: Added pet profile registration feature with microchip, photos, suburb
- 2026-02-21: Transformed "My Reports" tab into combined "My Pets" tab with sub-tabs
- 2026-02-21: Added "Report as Lost" quick action from registered pet profiles
- 2026-02-21: Added pet profile detail view with edit/delete capabilities
