#!/usr/bin/env bash
# Dev-only: mirrors public assets from sowieso.wero-wallet.eu for local clone work.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMG="$ROOT/public/media/images"
BASE="https://sowieso.wero-wallet.eu/media/images"

mkdir -p "$IMG/partners"

curl -fsSL "$BASE/sticker-phase-1-nl.png" -o "$IMG/sticker-phase-1-nl.png"
curl -fsSL "$BASE/footer-banks.svg" -o "$IMG/footer-banks.svg"
curl -fsSL "$BASE/footer-ideal.svg" -o "$IMG/footer-ideal.svg"
curl -fsSL "$BASE/footer-wero-logo.svg" -o "$IMG/footer-wero-logo.svg"

for f in abn-amro.png asn-bank.png bunq-black-white.png ing-bank.png knab.png \
  rabobank-logo.png revolut.png triodos.png buut.png finom.png mollie.png n26.png \
  nationale-nederlanden.png regiobank.png van-lanschot-kempen.png yoursafe.png; do
  curl -fsSL "$BASE/partners/$f" -o "$IMG/partners/$f" || true
done

echo "Assets saved under public/media/images"
