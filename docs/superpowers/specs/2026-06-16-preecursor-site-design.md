# Preecursor.com — Applied-AI Studio Site · Design Spec

**Date:** 2026-06-16
**Source design:** `ai-consulting-studio-launch/project/Praxis.dc.html` (Claude Design handoff, v3)
**Positioning:** A boutique competitor to Boston Consulting Group — applied-AI studio that *ships*, not just advises.

## 1. Goal

Recreate the handoff's single landing page **pixel-perfectly** as a real Next.js
site, then extend it into a **full multi-page site** in the same design language,
with production-grade **framer-motion** animation and the handoff's **WebGL
shader** field. Subtle, "expensive", calm motion — never flashy.

## 2. Stack & delivery

- **Next.js 16 (App Router) + TypeScript + Tailwind v4**, **static export**
  (`output: 'export'`, `trailingSlash: true`, `images.unoptimized`).
- **motion** (`motion/react`, the current framer-motion package) for animation.
- Build on a GitHub runner → rsync `out/` to the **connorodea Hetzner VPS**
  (`hetznerCO`) → served by **nginx**. No Node runtime in production.
- Repo: `connorodea/preecursor` (private). Litigation rules: `unset GITHUB_TOKEN`
  before `gh`; commits authored as the account-locked noreply.

> Next.js 16 notes (from bundled docs): Turbopack is the default builder;
> `params`/`searchParams` are **async Promises** in pages (detail routes must
> `await props.params` + export `generateStaticParams`); `next lint` removed;
> `data-scroll-behavior="smooth"` opts navigation back into smooth scroll.

## 3. Design tokens (from the handoff)

- **Surfaces:** paper `#edf1f7`, paper-2 `#e1e8f1`, paper-3 `#e6eefb`.
- **Ink:** `#112138` (primary text + dark sections), `#0b1322` (deepest).
- **Brand blues:** brand `#1b4fc7`, azure `#5b8def`, azure-light `#7fa6f2`, cyan `#5fc8e8`.
- **On-dark text:** mist `#eaf1fb`.
- **Type:** Newsreader (serif display + big numbers), Archivo (UI/body). clamp() ramps per source.
- **Motifs:** pill buttons (999px), glass nav (blur + saturate), layered navy shadows,
  hero/contact light gradient wash, dark bands with blue corner-glow, multiply overlays on imagery.

Encoded once in `app/globals.css` (`@theme`) + `lib/theme.ts` (TS constants for
the bespoke inline values needed for pixel fidelity).

## 4. Architecture

```
app/
  layout.tsx            root: fonts, metadata, <SiteChrome> (header+menu) + footer
  globals.css           Tailwind v4 @theme tokens + base
  page.tsx              landing page (section components)
  industries/           hub + [slug] detail (templated, generateStaticParams)
  capabilities/         hub + [slug] detail (templated)
  work/                 Client Impact hub + [slug] case studies
  insights/             hub + [slug] articles
  about/ careers/ worldwide/ leadership/ labs/ contact/   hub pages
components/
  ShaderField.tsx       WebGL fBm field (offscreen-pause, reduced-motion frame)
  PlaceholderImage.tsx  deterministic branded SVG art (replaces image-slot)
  chrome/               SiteChrome, SiteHeader, MegaMenu, SiteFooter
  sections/             landing-page sections
  ui/                   shared sub-page kit: SectionHero, ContentSplit, CardGrid, StatBand, CTASection, PageShell, Eyebrow, PillButton
lib/
  theme.ts  ia.ts  motion.tsx  content/*   (page copy data)
```

## 5. Information architecture

`lib/ia.ts` is the single source of truth (mega-menu, footer, static generation).
Two "Our Services" pillars (Industries, Capabilities) get **templated detail
pages** per leaf; every other leaf resolves to its **hub page + anchor**. Routes:

- Hubs: `/`, `/industries`, `/capabilities`, `/labs`, `/insights`, `/work`,
  `/about`, `/careers`, `/worldwide`, `/leadership`, `/contact`.
- Templated: `/industries/[slug]` (12), `/capabilities/[slug]` (8),
  `/work/[slug]` (case studies), `/insights/[slug]` (articles).

## 6. Components & motion

- **ShaderField** — ported GLSL, reused in hero / "Answer" feature / contact.
  Pauses offscreen; one static frame under reduced motion; CSS-gradient fallback.
- **Motion kit** (`lib/motion.tsx`): `Reveal`, `Stagger`/`StaggerItem`,
  `HeroStagger`/`HeroItem`, `CountUp`, `Magnetic`. All reduced-motion safe.
- **Animation language:** hero staggered rise+fade over the live shader; section
  scroll-reveals; count-up impact stats; spring-driven mega-menu overlay + panel
  cross-fade; magnetic CTAs + arrow nudges; snap work-scroller with animated dots;
  restrained clip/mask reveal on big serif headlines.
- **PlaceholderImage** — seeded SVG (navy/paper field + brand glows + faint
  geometric motif), deterministic per slot, swappable for real photos later.

## 7. Content

Landing copy is verbatim from the handoff. Sub-page copy is on-brand first-draft
marketing prose (clearly editable later), stored in `lib/content/*`. Email
normalized to `hello@preecursor.com`.

## 8. Accessibility & quality bar

- All motion degrades to static under `prefers-reduced-motion`.
- Semantic landmarks, focus styles, keyboard-operable menu (Esc closes), labelled controls.
- `tsc --noEmit` clean + `next build` (static export) green after every task.
- Mobile-first responsive: the source is desktop-spec'd; each section gets a
  defined stacked/mobile behavior.

## 9. Out of scope (v1)

Real CMS, real photography, auth/login (the "Log in" link points to contact),
search backend (menu search is presentational), live newsletter submission.
