# Peritia

Public face of **PeritiaOS** — landing site, docs portal, and live development updates.

> Tired of burning half a day fighting a fresh Linux install before you can write code? That’s the itch this project scratches.

## What PeritiaOS is

Developer-first Linux (AGPLv3) aimed at:

- Wizard-led setup instead of a generic desktop slog
- Rootless containers and build-friendly storage (Btrfs / `tmpfs`)
- Declarative environments via `.peritia.yaml`
- Same shape from laptop → CI → closer to prod
- Clear docs + auto push summaries while the OS image is built (~6-month track)

**This repo is not the OS image.** It is the visitor site and the planning home (`MILESTONES.md`, `SDLC.md`).

## Repo map

| Repo | Role |
| --- | --- |
| **Peritia** (this repo) | Site, docs explorer, `/updates` feed |
| [`peritia-backend`](https://github.com/millareskenneth/peritia-backend) | OS engines (Rust): pkg, declare, core |
| [`peritia-frontend`](https://github.com/millareskenneth/peritia-frontend) | OS TUIs / CLIs (Rust): wizard, dashboard, `peritia` CLI |

Planning board: [PeritiaOS Solo Board](https://github.com/users/millareskenneth/projects/3)

## Stack (this repo)

- **Next.js 16** / **React 19**
- Markdown + Mermaid docs
- GitHub Action → `src/data/dev-feed.json` on push
- LANGUAGE MODES (theme chrome only — product copy stays fixed)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
npm run smoke:os:m1   # OS image smoke (SKIP until an image exists)
```

## Status

- Site, docs, and updates feed: **live / shipping**
- Installable OS image + first packages: **under development** (see [MILESTONES.md](./MILESTONES.md))

## License

AGPLv3 — see product docs / `LICENSE` when present.
