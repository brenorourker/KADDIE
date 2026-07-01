# Kaddie Design System

React Native (Expo) monorepo for the Kaddie mobile design system and consumer app.

## Structure

```
kaddie/
├── apps/mobile/              # Expo app — imports @kaddie/ui
│   └── src/playground/       # In-app component catalog
├── packages/ui/              # Design system components and tokens
└── package.json              # Workspace root
```

## Prerequisites

- Node.js 20+
- pnpm 9+
- iOS Simulator (Xcode) and/or Android emulator
- [Expo Go](https://expo.dev/go) on a physical device (optional)

## Setup

```bash
pnpm install
```

## Run the mobile app

```bash
pnpm mobile
```

Press `i` for iOS simulator or `a` for Android emulator. Scan the QR code with Expo Go on a device.

## Playground (component catalog)

The app includes a built-in **Playground** screen — tap **Open playground** on the home screen to browse components and variants on a real device or simulator.

No separate tooling or dev server mode is required.

## Adding components

1. Add design tokens in `packages/ui/src/tokens/` if needed
2. Implement the component in `packages/ui/src/primitives/`
3. Export from `packages/ui/src/index.ts`
4. Register it in `apps/mobile/src/playground/registry.ts`
5. Add a screen under `apps/mobile/src/playground/screens/` showing each variant
6. Wire the screen in `apps/mobile/src/playground/Playground.tsx`
7. Use the component in app screens when ready

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm mobile` | Start Expo dev server |
| `pnpm mobile:ios` | Start Expo, open iOS |
| `pnpm mobile:android` | Start Expo, open Android |
