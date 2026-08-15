# Solo SDLC (quick ref)

Full milestone acceptance lives in [MILESTONES.md](./MILESTONES.md).

## Repos

| Repo | Role | Visibility |
| --- | --- | --- |
| **This repo (`Peritia`)** | Public site, docs, updates feed | Public face |
| [`peritia-backend`](https://github.com/millareskenneth/peritia-backend) | OS engines (pkg, declare, core) | Private |
| [`peritia-frontend`](https://github.com/millareskenneth/peritia-frontend) | OS wizard TUI, observability TUI, CLIs | Private |

Local checkouts (siblings): `../peritia-backend`, `../peritia-frontend`.

## Two speeds

1. **Site / docs / feed** — continuous; every push; visitor-clear status (**this repo**).
2. **OS image** — milestone every 3–4 weeks; tagged alphas only (**backend + frontend** repos).

## Capacity cap

When OS image work is active: **≤20% of the week** on site polish (themes, layout, non-blocker copy). **≥80%** on the current `milestone:M#`.

## Definition of done

You can post one honest visitor sentence on the updates feed. No sentence → not done.

## Issue templates

Use GitHub issue templates:

- **Site** — public surface bugs / polish (this repo)
- **OS milestone** — milestone-scoped OS work (prefer opening on backend/frontend as ownership fits)
