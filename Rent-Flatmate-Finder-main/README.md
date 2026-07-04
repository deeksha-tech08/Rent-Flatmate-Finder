# Rent & Flatmate Finder

AI-powered platform connecting room owners and tenants using compatibility scoring, real-time chat, and email notifications.

## Setup
1. Clone the repo
2. Backend: `cd server && npm install`
3. Frontend: `cd client && npm install`
4. Copy `.env.example` to `.env` in `server/` and fill in values (DB URL, JWT secret, LLM API key, email credentials)
5. Run migrations: `npx prisma db push` (inside `server/`)
6. Start backend: `npm run dev` (in `server/`)
7. Start frontend: `npm run dev` (in `client/`)

## Tech Stack
Node.js, Express, Prisma, PostgreSQL, Next.js, Socket.IO, Google Gemini API

## API Overview
- `/api/auth` — register, login (JWT-based, roles: TENANT/OWNER/ADMIN)
- `/api/listings` — CRUD for room listings
- `/api/profiles` — tenant preference profiles
- `/api/interests` — send/accept/decline interest requests
- `/api/chat` — real-time messaging (WebSocket + persisted history)

## Database Schema
Defined in `server/prisma/schema.prisma` — includes User, Listing, TenantProfile, Interest, Message, and AdminLog models with role-based relations.

## LLM Compatibility Scoring
Prompt used: "Given this room listing and this tenant profile, compute a compatibility score (0-100) based on budget and location match. Return JSON: { score, explanation }"

Example input: listing (rent ₹15000, location Kanpur), tenant profile (budget ₹12000-18000, preferred location Kanpur)
Example output: `{ "score": 88, "explanation": "Budget and location closely align." }`

If the LLM API is unavailable, the system falls back to a rule-based scoring algorithm using budget overlap and location match.