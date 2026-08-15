# PeritiaOS milestones (M1–M6)

Solo SDLC north star for the **~6-month** path to a first installable image.
Site/docs/feed ship continuously in **this repo**; OS engines/TUIs live in
[`peritia-backend`](https://github.com/millareskenneth/peritia-backend) and
[`peritia-frontend`](https://github.com/millareskenneth/peritia-frontend).
The OS ships by these milestones only.

**Operating rule:** one OS milestone WIP at a time. Site bugs may interrupt; new OS features may not.

**Capacity cap:** once OS image work is active, cap site/polish (LANGUAGE MODES, layout tweaks, non-blocker copy) at **~20% of the week**. The other ~80% goes to the current `milestone:M#` work.

**Risk order:** boot reliability → package install → containers → wizard UX → time-machine / sync toys.

**Done means:** you can write one honest visitor sentence for `/updates`. If you can’t, it’s not done.

---

## Tracks

| Track | Cadence | Done means |
| --- | --- | --- |
| Public surface (site, docs, feed) | Every push | Visitors understand status without git archaeology |
| OS core (image, packages, wizard, storage, containers) | Every 3–4 weeks | Checkable artifact or demable subsystem |

---

## M1 — Foundation

**Goal:** a base image that boots; storage layout decision locked.

**Non-goals:** pretty wizard UX, multi-language toolchains, eBPF dashboard.

### Acceptance

- [ ] Reproducible base image (or pinned rootfs) builds from this repo or a documented sibling path
- [ ] Image boots to a login or root console (VM or bare metal)
- [ ] Btrfs layout decision written under `docs/decisions/` (or ADRs folder when it exists)
- [ ] Package manager stub **or** clearly pinned base package set documented
- [ ] `scripts/os/smoke-m1.sh` exits 0 on a machine that has the image artifact (or documents SKIP reason)

**Visitor sentence example:** “First base image boots in a VM; storage layout is locked.”

**Kill criteria:** if boot is unstable after two focused weeks, freeze features and only chase boot.

---

## M2 — First-boot path

**Goal:** wizard TUI skeleton; a role profile applies something real.

**Non-goals:** full role catalog, cloud sync, time machine.

### Acceptance

- [ ] First-boot / setup entrypoint exists and is reachable after boot
- [ ] At least one role profile applies a tangible change (packages, files, or services)
- [ ] Dry-run or idempotent re-run does not brick the image
- [ ] Smoke covers: boot → open wizard → apply profile → verify one file/package/service

**Visitor sentence example:** “Setup wizard can apply a starter profile after first boot.”

---

## M3 — Containers

**Goal:** rootless container path works with a sample `.peritia.yaml` service.

**Non-goals:** full orchestration, multi-node sync.

### Acceptance

- [ ] Rootless Podman (or chosen runtime) runs hello-world without sudo
- [ ] Sample `.peritia.yaml` (or equivalent) brings up one service
- [ ] Documented difference from desktop Docker/sudo workflows
- [ ] Smoke covers: boot → rootless hello-world → sample service up

**Visitor sentence example:** “Rootless containers run out of the box; sample service from config.”

---

## M4 — Toolchain parity

**Goal:** multi-version toolchain for 1–2 languages; local CI runner sketch.

**Non-goals:** every language ecosystem, perfect SAT solver.

### Acceptance

- [ ] `.peritia.yaml` (or successor) can pin at least two toolchain versions or two languages
- [ ] Switching/applying toolchains is demable without hand-editing global OS packages
- [ ] Local CI runner sketch exists (script or binary stub that runs one job like the laptop)
- [ ] Smoke covers: apply toolchain pin → compile or run a tiny project

**Visitor sentence example:** “Pinned toolchains match what you’ll run in local CI.”

---

## M5 — Observability slice

**Goal:** one real “what’s slow” signal via eBPF/perf wrapper or TUI.

**Non-goals:** full APM product, distributed tracing mesh.

### Acceptance

- [ ] One wrapper or TUI shows live CPU/IO/pressure (or equivalent) on the running system
- [ ] Invokable with a one-line command from a fresh install path
- [ ] Smoke covers: boot → start load → tool shows non-empty signal

**Visitor sentence example:** “One command shows what’s stressing the machine.”

---

## M6 — Alpha image

**Goal:** installable artifact + smoke suite + public alpha notes.

**Non-goals:** production stability guarantees, time machine v1.

### Acceptance

- [ ] Tagged alpha (`v0.*.*-alpha`) with downloadable/installable artifact
- [ ] Full smoke path under ~15 minutes documented and green for M1–M5 core checks that still apply
- [ ] Known-issues list published (site `/updates` or docs)
- [ ] Public alpha note states limitations honestly (no fake “1.0”)

**Visitor sentence example:** “Alpha image is out — bootable, limited, here’s what works.”

---

## Labels & branches

- Labels: `site`, `os`, `docs`, `milestone:M1` … `milestone:M6`, `block`
- Branches: `main` always shippable for the site; `os/mN-*` for OS spikes
- Tags: site continuous; OS only `v0.*.*-alpha|beta`

## Site gate

Every push/PR to `main`: `npm run lint` + `npm run build` (see `.github/workflows/site-ci.yml`).

## OS gate

Per milestone: run the smoke script for the current milestone (start with [`scripts/os/smoke-m1.sh`](scripts/os/smoke-m1.sh)). Keep the whole suite under ~15 minutes.
