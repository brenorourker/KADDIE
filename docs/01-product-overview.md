# Product overview

**Audience:** investors, business, anyone new to KADDIE  
**Status as of:** July 2026 prototype

## What KADDIE is

KADDIE is a mobile golf caddie app that helps players choose the right club on course—using their bag distances, conditions (wind, lie, slope), and AI-style coaching.

## Core value loop

```text
Set up bag & distances → Start a round → See plays-like yardage & club advice → Adjust shot types / prefs → Better next recommendation
```

1. **Bag** — Player records clubs and distances (including partials like “Half-swing”).
2. **Round** — On the hole map they see front/middle/back, plays-like distance, wind, and a club suggestion.
3. **Advice** — Recommendations prefer the player’s real bag numbers over generic tables.
4. **Coach surface** — Voice / assistant entry points preview how KADDIE will talk through a shot (mock responses today).

## Who it’s for

- Golfers who want distance-aware club picks without juggling multiple apps
- Players who already track clubs in devices/apps and will eventually sync (import teaser in My bag)
- Teams evaluating the product via the web demo or Expo builds

## What’s built today

| Area | Status |
|------|--------|
| Design system (`@kaddie/ui`) | Live — tokens, primitives, playground |
| Auth & onboarding screens | UI flows; no real backend |
| Home, profile, preferences | Mostly interactive UI with persona mock data; Light / Dark / System appearance |
| My bag / club details | Live — distances + custom shot types |
| In-round map / scorecard / menu | Live demo on Elmgreen mock course |
| Wind visualization | Live overlay scaled by hole wind |
| Plays-like + club recommendation | Live formula + bag-aware matching |
| Voice mode | UI cycle with scripted responses |
| Web deploy (Vercel) | Expo web export of the full app |
| Third-party distance import | Teaser card only (“Coming soon”) |

## How to experience it

- **Local:** Expo app (`pnpm mobile`) — see [README](../README.md) and [HOW-TO-VIEW.md](../HOW-TO-VIEW.md)
- **Online:** Vercel web build of the same Expo app (persona launcher is the landing screen)
- **Personas:** Pick Seasoned user, New user onboarding, or In-round (map) from the launcher

## Not built yet (explicit)

- Real authentication, accounts, or cloud persistence
- Live GPS / course APIs / pin positions from a provider
- Production AI (LLM) caddie — voice and assistant are mocked
- Third-party sync (Arccos, Shot Scope, Garmin, etc.)
- Native App Store / Play Store release pipeline beyond Expo Go / web

## Tech snapshot

- **Monorepo:** pnpm workspaces — `apps/mobile` (Expo) + `packages/ui`
- **Navigation:** App-owned route state in `AppShell` (not React Navigation)
- **Data:** Persona-driven in-memory mocks (`PersonaProvider`)
- **Deploy:** `pnpm run build:web` → `apps/mobile/dist` via [vercel.json](../vercel.json)

## Related docs

- [Sitemap](02-sitemap.md) — every screen and how you reach it
- [Feature logic](03-feature-logic.md) — how each section works
- [Data & state](04-data-and-state.md) — where truth lives
- [For AI agents](05-for-ai.md) — orientation for other models
- [Demo walkthrough](06-demo-walkthrough.md) — investor / partner path
