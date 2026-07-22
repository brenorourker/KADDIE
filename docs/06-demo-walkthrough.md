# Demo walkthrough

**Audience:** investors, partners, stakeholders  
**Time:** ~5 minutes on the live web demo or local Expo build

## Before you start

1. Open the Vercel web app (or run the Expo app locally — see [HOW-TO-VIEW.md](../HOW-TO-VIEW.md)).
2. You should land on the **Persona launcher** (“Kaddie / Persona launcher”).
3. Prefer **Seasoned user** for the full bag + home experience. Use **In-round (map)** if you only want the course UI.

## 5-minute path

### 1. Launch Seasoned user
- Select **Seasoned user** → **Launch persona**.
- You’re on Home with greeting, handicap, and quick actions.

### 2. Show the bag and richer distances
- Open **My bag**.
- Open a wedge or iron (e.g. **PW**).
- Note **Standard swing**, then tap the green **+**.
- Add a shot type (placeholder hint: “Half-swing”), adjust yards → **Confirm**.
- Point out the new stepper under Standard swing and the delete control.
- Tap **Done**, then back out.
- Optionally scroll to **Import club distances** (Coming soon) — roadmap for Arccos / Shot Scope / Garmin sync.

### 3. Start a round
- From Home, start / configure a round (course, tees, format).
- Land on the **Map** tab: hole header, wind badge, distance sheet, club suggestion.

### 4. Call out on-course intelligence
- **Distances** — front / middle / back.
- **Plays like** — adjusts for lie, slope, wind, temperature (demo model).
- **Club label** — should reflect bag data (e.g. a partial if that distance is closest).
- **Wind flow** — colored streaks moving with wind strength/direction.

### 5. Scorecard & voice tease
- Switch to **Scorecard** — grid + shot stepper.
- Tap the **mic** FAB — voice overlay cycles listening → processing → a spoken-style tip (scripted today).
- Optional: sparkle FAB shows the AI caddie placeholder.

### 6. Menu controls
- Open **Menu** — Round settings, Preferences, Back to main menu, End round.
- **Back to main menu** → Home shows **Resume round** (session kept).
- **End round** → clears the session (confirm first).

## What’s impressive now

- End-to-end mobile UX from bag setup → on-course advice
- Bag-aware club picks including custom shot types
- Polished in-round map (wind, plays-like, scorecard, pause/resume)
- Shared design system and shareable web demo

## Honest roadmap (say this clearly)

| Now (prototype) | Next |
|-----------------|------|
| Persona mocks, no login backend | Real accounts & persistence |
| Demo course / wind formula | Live course + GPS / pin data |
| Scripted voice responses | Production AI caddie |
| Import teaser card | Real third-party distance sync |
| Expo / web demo | Store releases |

## Related docs

- [Product overview](01-product-overview.md)
- [Sitemap](02-sitemap.md)
- [Feature logic](03-feature-logic.md)
