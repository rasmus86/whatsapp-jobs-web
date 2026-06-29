#!/usr/bin/env bash
# Installs AgriciDaniel/claude-seo for WhatsApp Jobs (Cursor + Claude Code).
# https://github.com/AgriciDaniel/claude-seo
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENDOR="${ROOT}/tools/claude-seo"
TAG="${CLAUDE_SEO_TAG:-v2.0.0}"
REPO="https://github.com/AgriciDaniel/claude-seo"

echo "→ Claude SEO (${TAG}) → ${VENDOR}"

if [ -d "${VENDOR}/.git" ]; then
  echo "  Updating existing clone…"
  git -C "${VENDOR}" fetch --depth 1 origin "refs/tags/${TAG}" 2>/dev/null || git -C "${VENDOR}" fetch --depth 1 origin main
  git -C "${VENDOR}" checkout "${TAG}" 2>/dev/null || git -C "${VENDOR}" checkout main
else
  mkdir -p "${ROOT}/tools"
  git clone --depth 1 --branch "${TAG}" "${REPO}" "${VENDOR}"
fi

if command -v python3 >/dev/null 2>&1; then
  VENV="${VENDOR}/.venv"
  if [ ! -d "${VENV}" ]; then
    python3 -m venv "${VENV}"
  fi
  "${VENV}/bin/pip" install -q -r "${VENDOR}/requirements.txt" || true
fi

# Optional: global Claude Code skill (same as upstream install.sh)
if [ "${INSTALL_GLOBAL:-0}" = "1" ]; then
  bash "${VENDOR}/install.sh"
fi

echo "✓ Done. Cursor skill: .cursor/skills/whatsapp-jobs-seo/SKILL.md"
echo "  Audit locally: cd ${VENDOR} && python3 scripts/render_page.py --help"
