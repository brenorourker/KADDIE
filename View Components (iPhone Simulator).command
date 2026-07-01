#!/bin/bash
# Double-click this file to view components on the iPhone simulator.
# Leave the window open — updates appear automatically in the simulator.

cd "$(dirname "$0")"
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

echo ""
echo "  Kaddie Component Viewer"
echo "  -----------------------"
echo "  Opening iPhone simulator..."
echo "  First launch may take a few minutes."
echo "  Leave this window open while you review components."
echo "  To stop: close this window or press Ctrl+C"
echo ""

npx pnpm run playground:ios
