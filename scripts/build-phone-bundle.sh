#!/usr/bin/env bash
# Builds src/lib/phone.js into a standalone global for the blackwater-lp
# landing page, which has no build step of its own. Run this after ANY edit
# to src/lib/phone.js, or the two forms drift apart.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="${1:-../blackwater-lp/phone.js}"
npx esbuild src/lib/phone.js \
  --bundle --format=iife --global-name=BWPhone --minify \
  --banner:js="/* Generated from blackwater-v2/src/lib/phone.js - do not edit by hand. */" \
  --outfile="$OUT"
echo "wrote $OUT ($(wc -c < "$OUT") bytes, $(gzip -c "$OUT" | wc -c | tr -d ' ') gzipped)"
