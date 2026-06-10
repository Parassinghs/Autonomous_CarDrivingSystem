# PRD — Autonomous Vehicle Simulation Portfolio (AV.SIM)

## Original Problem Statement
Build a premium, single-page portfolio website for an "Autonomous Vehicle Simulation Project".
Dark, highly futuristic, cinematic aesthetic with glassmorphism, deep blacks, and neon-blue accents.
Sections: Hero with Eagle3D iframe (https://connector.eagle3dstreaming.com/v5/parasTheGreat/AutonomousCar/default),
Tech Specs 3-column (Reinforcement Learning, Real-Time Raytracing, Spline Pathfinding),
Training Logs & Results video grid (CMS-driven), and a minimalist contact footer.
Contact: LinkedIn https://www.linkedin.com/in/paras-singh-9b422129b/ , email parassinghme@gmail.com

## User Personas
- Owner (Paras Singh) — adds/edits training-log episodes via CMS.
- Recruiters / collaborators — view portfolio, watch the live sim, submit contact form.

## Architecture
- Backend: FastAPI + Motor (MongoDB), all routes under `/api`, passcode-protected admin via `X-Admin-Passcode` header.
- Frontend: React 19 (CRA + craco), Tailwind, shadcn/ui primitives, Sonner for toasts, react-router for `/admin`.
- DB collections: `training_logs`, `contact_messages`.
- 6 training logs are auto-seeded on first startup.

## What's Been Implemented (2026-06-10)
- Backend endpoints: `GET /`, `GET/POST/DELETE /training-logs`, `POST/GET /contact`, `POST /admin/verify`.
- Hero with Eagle3D iframe (cinematic neon border, scanline, pulse glow, corner brackets, FPS / timesteps / reward stats).
- Marquee ticker between hero and tech specs.
- Tech Specs grid (Brain / Zap / Route icons, glassmorphism cards with hover glow).
- Training Logs grid loading from `/api/training-logs` with hover play-overlay, badges, metric footer.
- Contact footer: form (POSTs to `/api/contact`) + LinkedIn + email cards.
- `/admin` page: passcode login (stored in localStorage), create-form with all fields, list with delete.
- Sonner dark toaster theme.
- Fonts: Unbounded (display), Outfit (body), JetBrains Mono (UI/labels).

## Core Requirements
- Single-page experience on `/` with smooth section navigation.
- CMS at `/admin` protected by passcode (default `paras-av-2026`, overridable via `ADMIN_PASSCODE` env).
- All API calls via `REACT_APP_BACKEND_URL`; all backend routes prefixed `/api`.

## Prioritized Backlog
- P1: Add an authenticated `/admin/messages` view to read contact submissions in-UI.
- P1: Image/file upload for thumbnails (currently URL-only).
- P2: Per-episode tags + filterable archive (PPO/SAC/Phase-N).
- P2: Open Graph metadata + preview image for shareability.
- P2: Replace passcode with proper JWT/Google auth.
- P3: Lifespan handlers instead of deprecated `@on_event`.
- P3: Rate-limit on `/api/contact`.

## Next Tasks
1. Decide on image upload backend (S3/Cloudinary) for thumbnails.
2. Wire optional email forwarding for contact form (Resend / SendGrid).
