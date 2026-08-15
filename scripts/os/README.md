# OS scripts

Milestone smoke lives here. Keep each suite under ~15 minutes.

| Script | Milestone | Run |
| --- | --- | --- |
| `smoke-m1.sh` | M1 Foundation | `npm run smoke:os:m1` |

Without an image artifact, M1 smoke **SKIP**s (exit 0) and prints where to put the image:

```bash
export PERITIA_IMAGE_PATH=/path/to/peritia-m1.img
npm run smoke:os:m1
```

Default image path: `dist/os/peritia-m1.img`
