#!/bin/bash
# Double-click this file to save your latest changes and push them to GitHub.

cd "$(dirname "$0")"
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

REPO_URL="https://github.com/brenorourker/KADDIE"

echo ""
echo "  Kaddie — Push to GitHub"
echo "  -----------------------"
echo ""

if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "  Error: This folder is not a git repository."
  echo ""
  read -r -p "Press Enter to close..."
  exit 1
fi

echo "  Checking for changes..."
echo ""

if git diff --quiet && git diff --cached --quiet; then
  echo "  No file changes to commit."
else
  echo "  Files to upload:"
  git status --short
  echo ""
  read -r -p "  Commit message (press Enter for 'Update'): " MSG
  MSG=${MSG:-Update}
  git add .
  git commit -m "$MSG"
  echo ""
fi

echo "  Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "  Success! Your code is on GitHub:"
  echo "  $REPO_URL"
else
  echo ""
  echo "  Push failed."
  echo "  You may need to sign in to GitHub again."
  echo "  Try running the push once in Terminal, or use GitHub Desktop."
fi

echo ""
read -r -p "Press Enter to close..."
