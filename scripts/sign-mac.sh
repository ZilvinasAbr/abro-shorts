#!/bin/bash
# Fix code signing for macOS builds

echo "Fixing code signatures for macOS builds..."

find dist -name "*.app" -maxdepth 2 | while read app; do
  echo "Processing: $app"

  # Remove existing signatures
  codesign --remove-signature "$app" 2>/dev/null || true

  # Re-sign with ad-hoc signature
  codesign --force --deep --sign - "$app"

  # Verify
  if codesign -v "$app" 2>&1; then
    echo "✓ Successfully signed: $app"
  else
    echo "✗ Failed to sign: $app"
  fi
done

echo "Done!"
