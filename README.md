# InterviewAce Pro

AI-powered interview practice platform with real-time analysis of body language, speech, and emotions. Built with React + TypeScript + Vite + Tailwind, Express backend, and shared types.

## Features (first implementation)

- Dynamic landing page: hero, features, companies, domains, testimonials, pricing
- Global layout, dark mode (next-themes), responsive design
- Dashboard page with interactive charts (Recharts)
- Routing with React Router 6 and placeholders for Login/Register/Pricing

## Getting Started

1. Copy `.env.example` to `.env` and fill values as needed
2. Run the dev server
   - pnpm dev
3. Build for production
   - pnpm build

## Project Structure

- client/: React SPA (pages, components, hooks)
- server/: Express API (dev-integrated)
- shared/: Shared types between client and server

## Deployment

- Frontend: Vercel or Netlify
- Backend: Railway/Render/AWS with `pnpm build && pnpm start`

## Next steps

- Implement authentication (JWT + refresh tokens)
- Real-time interview session pipeline (WebRTC/Media APIs)
- MCQ practice flows and persistent analytics
- Payments (Stripe) and role-based plans
