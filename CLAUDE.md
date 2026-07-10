# CLAUDE.md — blackwater-v2 (agency website)

## What this is
BlackWater Marketing's public site. React/Vite SPA, deployed on Cloudflare Pages. Live at blackwatermrkting.com (blackwater-v2.pages.dev).

## Stack
- Vite + React (JSX, no TypeScript), Tailwind v4 present but components use INLINE STYLE OBJECTS — match that, don't introduce Tailwind classes into components.
- Framer Motion (scroll reveals) + GSAP ScrollTrigger (FlowArt pinned sections) + Lenis smooth scroll — one shared rAF loop in App.jsx.

## Commands
- Dev: `npm run dev` · Build: `npm run build`
- Deploy: `npm run build && npx wrangler pages deploy dist --project-name=blackwater-v2 --commit-dirty=true`

## Gotchas (each one has bitten before)
- **git push does NOT deploy.** Cloudflare is wired to direct wrangler uploads only — repo and live site drifted for weeks over this. Always deploy via wrangler, but still commit+push to keep GitHub synced.
- About + Method sections are a LOCKED PAIR inside FlowGroup1 (GSAP pin choreography). Never move one without the other; after any reorder, verify the pin still works by scrolling it.
- Don't touch the Lenis/GSAP ticker setup in App.jsx or FlowArt.jsx internals.
- Design tokens: bg #080808, cream #f2ede4, white #ffffff, lime accent #C8D746. Lime is accent-only (buttons/text) — no full lime sections since Jul 2026.
- Site-wide CTA label is "Apply Now" → Calendly (calendly.com/blkwtrenterprises/45). Don't rename buttons or swap the link without asking.
- Client logo assets live in public/client-logos/ (pre-processed: transparent, 160px tall, <40KB). Process new logos the same way before adding.

## Verify before "done"
- `npm run build` clean, then after deploy: load the production URL cache-ignored and confirm the specific change is actually serving.
