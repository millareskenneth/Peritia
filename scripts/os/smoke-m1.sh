#!/usr/bin/env bash
# M1 smoke — keep this under ~15 minutes when an image exists.
# Until artifacts land, this script exits 0 with an explicit SKIP so CI/local
# rituals stay honest without fake green lies about a missing OS.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
IMAGE_PATH="${PERITIA_IMAGE_PATH:-$ROOT/dist/os/peritia-m1.img}"
TIMEOUT_SECS="${PERITIA_SMOKE_TIMEOUT:-600}"

log() { printf 'smoke-m1: %s\n' "$*"; }
fail() { printf 'smoke-m1: FAIL: %s\n' "$*" >&2; exit 1; }

log "root=$ROOT"
log "image=$IMAGE_PATH"
log "timeout=${TIMEOUT_SECS}s"

if [[ ! -f "$IMAGE_PATH" ]]; then
  log "SKIP — no image at $IMAGE_PATH"
  log "Set PERITIA_IMAGE_PATH when M1 artifacts exist."
  log "Acceptance checklist: MILESTONES.md → M1"
  exit 0
fi

# --- Live checks (enable as the image builder lands) ---

command -v qemu-system-x86_64 >/dev/null 2>&1 \
  || fail "qemu-system-x86_64 required to boot-smoke $IMAGE_PATH"

WORK="$(mktemp -d "${TMPDIR:-/tmp}/peritia-smoke-m1.XXXXXX")"
cleanup() { rm -rf "$WORK"; }
trap cleanup EXIT

log "booting image (console wait)…"
# Expect a login/root prompt string once the serial console is wired in the image.
# Adjust EXPECT_PROMPT when the real image lands.
EXPECT_PROMPT="${PERITIA_EXPECT_PROMPT:-login:|root@|# }"

set +e
timeout "$TIMEOUT_SECS" qemu-system-x86_64 \
  -machine q35 \
  -m 2048 \
  -nographic \
  -serial mon:stdio \
  -drive "file=${IMAGE_PATH},format=raw,if=virtio" \
  >"$WORK/console.log" 2>&1 &
QEMU_PID=$!

# Poll console log for a boot prompt
deadline=$((SECONDS + TIMEOUT_SECS))
booted=0
while (( SECONDS < deadline )); do
  if grep -Eiq "$EXPECT_PROMPT" "$WORK/console.log" 2>/dev/null; then
    booted=1
    break
  fi
  if ! kill -0 "$QEMU_PID" 2>/dev/null; then
    break
  fi
  sleep 2
done

kill "$QEMU_PID" 2>/dev/null || true
wait "$QEMU_PID" 2>/dev/null || true
set -e

if (( booted != 1 )); then
  tail -n 80 "$WORK/console.log" >&2 || true
  fail "did not observe boot prompt matching /$EXPECT_PROMPT/"
fi

log "boot prompt seen"
log "PASS — M1 boot smoke"
exit 0
