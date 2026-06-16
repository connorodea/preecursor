# Preecursor.com — Implementation Plan

Executed via **subagent-driven development**: fresh implementer subagent per
task, controller (Opus) reviews each diff for spec-compliance + quality with an
objective `tsc` + `next build` gate, plus a dedicated reviewer subagent for the
landing page and the final pass. Foundation already built by the controller.

## Phase 0 — Foundation (DONE, controller)
- Next.js 16 + TS + Tailwind v4 + motion scaffold; static-export config; `turbopack.root`.
- `app/globals.css` `@theme` tokens + base; `app/layout.tsx` fonts (Newsreader/Archivo) + metadata.
- `lib/theme.ts`, `lib/ia.ts`, `lib/motion.tsx`, `components/ShaderField.tsx`, `components/PlaceholderImage.tsx`.
- ✅ `tsc --noEmit` clean, ✅ `next build` static export green.

## Phase 1 — Implementation tasks

**T1 · Site chrome.** `components/chrome/`: `SiteHeader` (glass nav pills, logo,
hamburger→openMenu, Log in), `MegaMenu` (full-screen overlay; left index from
`LEFT_ENTRIES`, right panel from `PANELS[active]`, hover/click to switch panel,
spring open/close via `AnimatePresence`, Esc + scroll-lock, search input
presentational, links route via `next/link`), `SiteFooter` (4-col from `FOOTER`),
and a client `SiteChrome` that owns `menuOpen` state. Wire into `app/layout.tsx`.

**T2 · Landing page.** Recreate `Praxis.dc.html` pixel-perfectly as
`components/sections/*` composed in `app/page.tsx`: Hero (shader + HeroStagger +
Magnetic CTA), ImpactBand (CountUp, dark), Capabilities (numbered rows, Reveal),
AnswerFeature (shader panel), SelectedWork (snap scroller + animated dots + drag,
client), Spotlight grid, Approach (3-up), Locations, People (logos, dark),
Careers (split), FeaturedInsights + newsletter, ContactCTA (shader). Use
`PlaceholderImage` for every image slot. **Dedicated reviewer subagent.**

**T3 · Sub-page UI kit.** `components/ui/`: `PageShell`, `SectionHero` (eyebrow +
serif H1 + lede, optional shader), `ContentSplit`, `CardGrid`, `StatBand`,
`FeatureRows`, `CTASection`, `Eyebrow`, `PillButton`. These compose every hub.

**T4 · Industries + Capabilities.** Hubs (`/industries`, `/capabilities`) listing
leaves as cards from `ia.ts`; templated detail pages `[slug]` with
`generateStaticParams` + async `params`. Content in `lib/content/services.ts`.

**T5 · Work + Insights.** `/work` (Client Impact: case-study grid, stats) +
`/work/[slug]` (4 case studies matching the landing cards). `/insights`
(articles index + categories as anchors) + `/insights/[slug]` (3–4 articles).

**T6 · About + Leadership + Careers.** `/about` (story, values, how-we-work
anchor), `/leadership` (partners/advisors/operators/researchers, dark people
band), `/careers` (roles, life, CTAs).

**T7 · Worldwide + Labs + Contact.** `/worldwide` (locations), `/labs` (research
& tooling), `/contact` (shader hero + details; "Log in"/CTAs land here).

**T8 · CI/CD + deploy.** `.github/workflows/deploy.yml` (build → rsync `out/` to
`hetznerCO` via `HETZNER_CO_*` secrets), `deploy/nginx.preecursor.conf`,
`README_DEPLOY.md`, `.gitignore` for `/out` & `.next`. DNS (Namecheap
preecursor.com → VPS) documented; server push is dry-run + user-approved.

## Phase 2 — Finish
- Full-site reviewer subagent (fidelity, a11y, responsive, reduced-motion).
- `tsc` + `next build` green; open PR into `main` (do not merge without instruction).

## Invariants (every task)
- `tsc --noEmit` clean and `next build` (static export) green before a task is "done".
- Reduced-motion safe; semantic + keyboard-accessible; mobile responsive.
- Match handoff tokens/spacing; reuse `lib/theme.ts`, `lib/ia.ts`, `lib/motion.tsx`.
- Read `node_modules/next/dist/docs` before using any unfamiliar Next 16 API (per AGENTS.md).
