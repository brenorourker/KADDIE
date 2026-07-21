#!/bin/bash
# Double-click to run the app on your phone with Expo Go.
# Leave this window open while you test on your device.

cd "$(dirname "$0")"
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

echo ""
echo "  Kaddie — Expo Go (real phone)"
echo "  -----------------------------"
echo ""
echo "  1. Install Expo Go on your phone (App Store / Play Store)"
echo "  2. Make sure phone and Mac are on the SAME Wi‑Fi"
echo "  3. When a QR code appears below:"
echo "     • iPhone: open Camera, point at QR code, tap the banner"
echo "     • Android: open Expo Go, tap Scan QR code"
echo ""
echo "  Leave this window open while testing."
echo "  To stop: close this window or press Ctrl+C"
echo ""

npx pnpm run mobile
