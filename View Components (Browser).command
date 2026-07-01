#!/bin/bash
# Double-click this file to view components in your web browser.
# Leave the window open — when components are updated, refresh the browser (Cmd+R).

cd "$(dirname "$0")"
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

echo ""
echo "  Kaddie Component Viewer"
echo "  -----------------------"
echo "  Opening in your browser..."
echo "  Leave this window open while you review components."
echo "  To stop: close this window or press Ctrl+C"
echo ""

npx pnpm run playground:web
