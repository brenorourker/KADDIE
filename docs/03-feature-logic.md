# Feature logic

**Audience:** developers, AIs, product  
Each section: **goal → user steps → key logic → key files → known limits**.

---

## Personas

**Goal:** Demo different product moments without a backend.

**User steps:** Open app → choose persona on launcher → Launch (optional: Start from login).

**Key logic:**
- Registry exposes three personas: Seasoned, Onboarding, In-round.
- Each persona has `entryRoute`, `flags`, and a full `data` blob (home, bag, prefs, club details, auth, round config).
- `PersonaProvider` holds active persona, club selection overrides, and club detail overrides for the session.

**Key files:**
- [`apps/mobile/src/personas/registry.ts`](../apps/mobile/src/personas/registry.ts)
- [`apps/mobile/src/personas/PersonaProvider.tsx`](../apps/mobile/src/personas/PersonaProvider.tsx)
- [`apps/mobile/src/app/AppHome.tsx`](../apps/mobile/src/app/AppHome.tsx)

**Known limits:** Switching persona resets overrides. `newUserPersona` exists in code but is not in the launcher registry (onboarding variant is used instead). No cloud sync.

---

## Home / round start

**Goal:** Enter the product hub and start or resume a round.

**User steps:**
1. Seasoned persona lands on Home.
2. Configure round (course, tees, format, golfers) → start.
3. During a paused round, Home shows **Resume round**.
4. Quick actions open Preferences, My bag, etc. (some still stub alerts).

**Key logic:**
- `AppShell` tracks `hasActiveRound`, `activeRoundConfig`, and `roundSessionKey`.
- Starting a round increments session key and mounts `InRoundShell` under `RoundMapProvider`.
- Leaving keeps the shell mounted but inactive; ending clears `hasActiveRound`.

**Key files:**
- [`apps/mobile/src/screens/HomeScreen.tsx`](../apps/mobile/src/screens/HomeScreen.tsx)
- [`apps/mobile/src/components/ConfigureRoundModal.tsx`](../apps/mobile/src/components/ConfigureRoundModal.tsx)
- [`apps/mobile/src/app/AppShell.tsx`](../apps/mobile/src/app/AppShell.tsx)

**Known limits:** Round config is local state. Course list is mock options. Stats / coaching quick actions are not wired.

---

## My bag & clubs

**Goal:** Manage clubs and richer distance data for recommendations.

**User steps:**
1. Open My bag → browse sections (woods, irons, wedges…).
2. Add clubs or open Club details.
3. Set make, name, **Standard swing** distance.
4. Tap **+** → Add shot type modal (label + distance) → Confirm.
5. Edit shot-type distances in place; delete with the close button.
6. Tap Done to persist into persona overrides for the session.
7. Bottom **Import club distances** card shows Coming soon.

**Key logic:**
- Bag list is derived from club selection + details (`buildBagDataFromSelection`).
- Shot types are stored on `ClubDetails.shotTypes`.
- Import card is presentational + alert only.

**Key files:**
- [`apps/mobile/src/screens/MyBagScreen.tsx`](../apps/mobile/src/screens/MyBagScreen.tsx)
- [`apps/mobile/src/screens/ClubDetailsScreen.tsx`](../apps/mobile/src/screens/ClubDetailsScreen.tsx)
- [`apps/mobile/src/components/AddShotTypeModal.tsx`](../apps/mobile/src/components/AddShotTypeModal.tsx)
- [`apps/mobile/src/screens/AddClubScreen.tsx`](../apps/mobile/src/screens/AddClubScreen.tsx)

**Known limits:** Changes don’t survive a full app reload / persona switch. No real manufacturer catalog. Import not implemented.

---

## Preferences

**Goal:** Game units, Kaddie personality, account/support surfaces.

**User steps:** Home or in-round Menu → Preferences → section rows → detail screens where implemented.

**Key logic:**
- Top-level groups: Game settings, My Kaddie, Account, Support.
- **App appearance** (Light / Dark / System) is live — stored via `AppearanceProvider` / AsyncStorage; themes non–in-round UI through `@kaddie/ui` `ThemeProvider`.
- Some toggles/units are local UI state; deeper sections use [`PreferenceSectionScreen`](../apps/mobile/src/screens/preferences/PreferenceSectionScreen.tsx) + mock content.
- Opening Preferences from in-round is an overlay so the round session stays alive.

**Key files:**
- [`apps/mobile/src/screens/PreferencesScreen.tsx`](../apps/mobile/src/screens/PreferencesScreen.tsx)
- [`apps/mobile/src/screens/preferences/`](../apps/mobile/src/screens/preferences/)
- [`apps/mobile/src/app/AppearanceProvider.tsx`](../apps/mobile/src/app/AppearanceProvider.tsx)

**Known limits:** Many rows are mock or alert stubs. Subscription is not production-backed. Unit prefs are not yet wired into every distance display. In-round UI ignores appearance and stays on `inRoundColors`.

---

## In-round map

**Goal:** Orient on the hole, read distances/conditions, get a club pick.

**User steps:**
1. Land on Map tab (or In-round persona).
2. Pinch/pan the course map; use hole header to change holes.
3. Read front / middle / back and plays-like in the bottom sheet.
4. Adjust lie / slope when expanded.
5. Observe wind badge + flowing wind streaks.
6. Optional target mode for aiming overlays.

**Key logic:**
- Hole data from mock Elmgreen set (`elmgreenHoles`) including wind kph/bearing and temperatures.
- Plays-like adjusts middle yards for lie, slope, wind, temperature (`computePlaysLikeYards`).
- Club recommendation uses bag options when present (see Club recommendation).
- Wind flow density/speed/opacity scale with wind; streaks fade trail→tip and jitter ±3°.

**Key files:**
- [`apps/mobile/src/screens/in-round/RoundMapScreen.tsx`](../apps/mobile/src/screens/in-round/RoundMapScreen.tsx)
- [`apps/mobile/src/components/in-round/RoundMapCanvas.tsx`](../apps/mobile/src/components/in-round/RoundMapCanvas.tsx)
- [`apps/mobile/src/components/in-round/WindFlowOverlay.tsx`](../apps/mobile/src/components/in-round/WindFlowOverlay.tsx)
- [`apps/mobile/src/round/RoundMapProvider.tsx`](../apps/mobile/src/round/RoundMapProvider.tsx)
- [`apps/mobile/src/round/services/playsLikeDistance.ts`](../apps/mobile/src/round/services/playsLikeDistance.ts)
- [`apps/mobile/src/round/hooks/useMapViewport.ts`](../apps/mobile/src/round/hooks/useMapViewport.ts)

**Known limits:** Demo course imagery/coords, not live GPS. Plays-like is a simple demo formula. Target mode is prototype-level.

---

## Scorecard

**Goal:** Track hole scores and access caddie / voice from a dedicated surface.

**User steps:** Switch to Scorecard tab → edit shot count → browse hole grid → optional voice FAB.

**Key logic:**
- `holeScores` map stores strokes per hole number; shot stepper updates current hole.
- Changing holes commits the current shot number when dirty.
- Distances / plays-like / club label reuse round context; wind badge is centered on the distances band.
- Caddie FABs show on scorecard only.

**Key files:**
- [`apps/mobile/src/screens/in-round/RoundScorecardScreen.tsx`](../apps/mobile/src/screens/in-round/RoundScorecardScreen.tsx)
- [`apps/mobile/src/components/in-round/ScorecardGrid.tsx`](../apps/mobile/src/components/in-round/ScorecardGrid.tsx)
- [`apps/mobile/src/components/in-round/ShotNumberStepper.tsx`](../apps/mobile/src/components/in-round/ShotNumberStepper.tsx)

**Known limits:** No handicapping / net scoring. Scores are session-only.

---

## Menu

**Goal:** Round controls without leaving the session unintentionally.

**User steps:** Menu tab → Round settings / Preferences / Back to main menu / End round (with confirm).

**Key logic:**
- Round settings opens `ConfigureRoundModal` and updates round config in provider.
- Preferences opens in-shell overlay.
- Leave vs end use confirm modal; icons match menu rows (exit / flag).
- `isActive` closes modals when the round is paused so portals don’t block home.

**Key files:**
- [`apps/mobile/src/screens/in-round/RoundMenuScreen.tsx`](../apps/mobile/src/screens/in-round/RoundMenuScreen.tsx)

**Known limits:** Multi-golfer “Add golfer” on configure is a placeholder.

---

## Voice mode

**Goal:** Preview conversational caddie UX.

**User steps:** On scorecard, tap mic FAB → overlay cycles listening → processing → responding; toggle mic to pause; close to dismiss.

**Key logic:**
- Timed state machine in `useVoiceMode` (no real speech recognition/TTS).
- Response text from `getVoiceModeResponse` using hole, distances, and club recommendation.

**Key files:**
- [`apps/mobile/src/round/hooks/useVoiceMode.ts`](../apps/mobile/src/round/hooks/useVoiceMode.ts)
- [`apps/mobile/src/components/in-round/voice/`](../apps/mobile/src/components/in-round/voice/)
- [`apps/mobile/src/round/services/voiceModeResponses.ts`](../apps/mobile/src/round/services/voiceModeResponses.ts)
- [`apps/mobile/src/components/in-round/CaddieFab.tsx`](../apps/mobile/src/components/in-round/CaddieFab.tsx)

**Known limits:** Scripted lines only. Sparkle FAB opens a placeholder “AI Caddie” modal.

---

## Club recommendation

**Goal:** Suggest a club (and shot type) closest to plays-like yardage.

**User steps:** Implicit — label appears in bottom sheet / scorecard / voice copy whenever bag distances exist.

**Key logic:**
1. Build options from every bag club’s standard distance and each shot type → labels like `PW` or `Half-swing PW`.
2. Skip putter.
3. Pick the option with smallest absolute distance delta to plays-like yards.
4. If no bag options, fall back to legacy soft-iron distance table.

**Key files:**
- [`apps/mobile/src/round/services/clubRecommendation.ts`](../apps/mobile/src/round/services/clubRecommendation.ts)
- Wired in [`RoundMapProvider.tsx`](../apps/mobile/src/round/RoundMapProvider.tsx)

**Known limits:** Closest-distance only (no wind direction into club choice, no dispersion). Doesn’t yet consume preference unit toggles.

---

## Related docs

- [Sitemap](02-sitemap.md)
- [Data & state](04-data-and-state.md)
- [For AI agents](05-for-ai.md)
