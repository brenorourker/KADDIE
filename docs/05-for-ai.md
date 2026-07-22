# For AI agents

**Audience:** Cursor agents and other LLMs working in this repo  
Keep this file short. Prefer linking to deeper docs over copying them.

## What this repo is

KADDIE is an Expo React Native monorepo golf caddie prototype with a shared design system. Data is **persona mocks**, not a real backend.

## Monorepo map

```text
apps/mobile/          Expo app (screens, round, personas, playground)
packages/ui/          @kaddie/ui — tokens, primitives, icons
vercel.json           Web export deploy (pnpm build:web → apps/mobile/dist)
docs/                 Product / system documentation
```

## Start here (code)

| Need | Open first |
|------|------------|
| Routes / screen wiring | `apps/mobile/src/app/AppShell.tsx`, `routes.ts` |
| Persona launcher | `apps/mobile/src/app/AppHome.tsx` |
| Mock data / bag | `apps/mobile/src/personas/` |
| In-round session | `apps/mobile/src/round/RoundMapProvider.tsx` |
| Map UI | `apps/mobile/src/components/in-round/RoundMapCanvas.tsx` |
| Club pick logic | `apps/mobile/src/round/services/clubRecommendation.ts` |
| Design system | `packages/ui/src/primitives/`, `packages/ui/src/tokens/` |

## Hard conventions

1. **Navigation** — AppShell `route` state only. Do not add React Navigation unless asked.
2. **UI** — Reuse `@kaddie/ui` primitives and tokens. Don’t invent one-off design systems.
3. **Mocks** — Extend personas / providers; don’t scaffold a fake REST API by default.
4. **In-round pause** — Leaving the round keeps `InRoundShell` mounted; ending clears it. Don’t break that with `display: none` patterns that kill press handling.
5. **Web** — Production builds use Expo web export. Persona launcher is enabled in production (`devLauncher: true`).

## Docs index

- [Product overview](01-product-overview.md) — what exists vs not
- [Sitemap](02-sitemap.md) — screens and flows
- [Feature logic](03-feature-logic.md) — section behavior
- [Data & state](04-data-and-state.md) — providers and types
- [Demo walkthrough](06-demo-walkthrough.md) — human demo path

## Commands

```bash
pnpm install
pnpm mobile                 # Expo dev
pnpm run build:web          # Static web export for Vercel
```

Human viewing / deploy notes: [HOW-TO-VIEW.md](../HOW-TO-VIEW.md), [README.md](../README.md).

## When implementing UI from Figma

Follow the repo’s existing screen patterns (spacing, typography, `@kaddie/ui` Button/Input/Icon). Match nearby screens rather than generating a new layout language.
