# How to view components

You do **not** need Terminal skills. You do **not** need to restart every time we update a component.

---

## The simple workflow

1. **Start once** — double-click a launcher file (below)
2. **Leave it open** — keep the black window and browser/simulator open
3. **Review updates** — when a component changes, it updates on its own (or press **Cmd+R** in the browser)

That’s it. Start once per session, not once per change.

---

## Which launcher to use?

### Recommended: Browser (easiest)

**Double-click:** `View Components (Browser).command`

- Opens in Chrome/Safari
- Fastest to start
- Good for reviewing layout, colors, and typography
- If an update doesn’t show: press **Cmd+R** to refresh

### Optional: iPhone Simulator (closest to real app)

**Double-click:** `View Components (iPhone Simulator).command`

- Shows an iPhone on your Mac screen
- First launch can take several minutes (installs Expo Go once)
- Use when you want to check how it feels on a phone

---

## What you’ll see

The app opens straight to **Playground** — a list of components.

1. Tap **Button** to see button variants
2. Tap **← Back** to return to the list

---

## When working with me (Cursor)

| I do | You do |
|------|--------|
| Build or update a component from Figma | Nothing — if the viewer is already open |
| Tell you “ready to review” | Glance at the browser or simulator |
| Ask for feedback | Say what to change (“make the green darker”, etc.) |

You only double-click the launcher again if you **closed** the viewer window.

---

## If something goes wrong

| Problem | Fix |
|---------|-----|
| Browser is blank | Press **Cmd+R** |
| “Port already in use” | Close any old black Terminal windows, double-click the launcher again |
| Simulator won’t open | Use the **Browser** launcher instead |
| First time setup | Install Node from [nodejs.org](https://nodejs.org) (one-time) |

---

## View online (share a link with anyone)

GitHub shows your **code files**. To view the **live component playground** in a browser:

1. Double-click **`Push to GitHub.command`** (uploads latest changes)
2. Go to **[vercel.com](https://vercel.com)** and sign in with **GitHub**
3. Click **Add New… → Project**
4. Import **`brenorourker/KADDIE`**
5. Leave the default settings and click **Deploy**
6. Wait ~2 minutes — Vercel gives you a link like `https://kaddie-xxx.vercel.app`

Open that link on any phone or computer. Tap **Open playground** to browse components.

After the first setup, every time you push to GitHub, Vercel updates the live site automatically.

**If you see a 404 or blank page:** the deploy config may not be on GitHub yet. Double-click **`Push to GitHub.command`**, then in Vercel open your project → **Deployments** → **Redeploy** (latest commit). Build settings should be:
- Build command: `pnpm run build:web`
- Output directory: `apps/mobile/dist`

---

## Files in this folder

| File | Purpose |
|------|---------|
| `View Components (Browser).command` | **Start here** — view locally in browser |
| `View Components (iPhone Simulator).command` | View on simulated iPhone |
| `Push to GitHub.command` | Upload changes to GitHub |
| `packages/ui/` | Where components are built (you don’t need to open this) |
