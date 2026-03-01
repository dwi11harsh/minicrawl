# Minicrawl

minicrawl is a scraper which works on top of browser automation. Currently minicrawl is using [Patchright](https://github.com/Kaliiiiiiiiii-Vinyzu/patchright) to bypass WAFs but I am also working on a separate project `Passright` which will a drop-in replacement for [Patchright](https://github.com/Kaliiiiiiiiii-Vinyzu/patchright).

![V0 Minicrawl Architecture](https://github.com/dwi11harsh/minicrawl/blob/main/public/v1.minicrawl-architecture.png)

---

## Project Structure

Minicrawl is a **Bun workspace monorepo**. All packages live under `src/` and are referenced via `@mc/*` import aliases — no `../../` paths across package boundaries.

```
minicrawl/                   ← workspace root
├── package.json             ← workspaces declared here
├── bun.lock                 ← single lockfile for the whole monorepo
└── src/
    ├── api/                 ← @mc/api   (app — entry point, runs with Bun)
    ├── types/               ← @mc/types (shared TypeScript types)
    └── services/
        ├── redis/           ← @mc/redis (BullMQ + ioredis)
        ├── logger/          ← @mc/logger
        ├── workers/         ← @mc/logger (BullMQ workers)
        └── db/              ← @mc/db    (Prisma + Postgres)
```

---

## Adding a New Package

### App (e.g. a Next.js frontend `src/web`)

1. Scaffold the package under `src/web/`.
2. Give it a `package.json` with `"name": "@mc/web"` and whatever `dev`/`build`/`start` scripts it needs.
3. Add `"src/web"` to the `"workspaces"` array in the **root** `package.json`.
4. Run `bun install` from the root — Bun symlinks it into `node_modules/`.

### Service (e.g. `src/services/email`)

Same steps as an app, but **do not add a build script**. Services are transpiled by Bun at the point of import. Add only operational scripts (e.g. Prisma `db:generate`, `db:migrate`).

### Managing Workspace Packages

Bun's `--filter` flag allows you to target specific packages by their name (e.g., `@mc/api`).

#### Installing a Package into a Specific Workspace

```bash
# Add a dependency to @mc/api
bun add <package> --filter @mc/api

# Add a dev dependency to @mc/db
bun add -D <package> --filter @mc/db
```

#### Running Scripts in a Specific Workspace

You can run a script defined in a package's `package.json` without changing directories:

```bash
# Run 'db:migrate' in @mc/db
bun run --filter @mc/db db:migrate

# Run 'dev' in @mc/api
bun run --filter @mc/api dev
```

### Adding a Root-Level Shortcut

If you frequently run a specific command, you can still add a shortcut to the root `package.json`:

```json
{
	"scripts": {
		"dev": "bun run --filter @mc/api dev"
	}
}
```

Then run it from the root with `bun run dev`.

### Cross-Package Imports

Every package declares the sibling aliases it needs in its own `tsconfig.json` under `compilerOptions.paths`. Bun resolves them at runtime via workspace symlinks — no compilation step required.

```ts
// clean cross-package import
import type { ScrapeRequestType } from '@mc/types';
import { createQueue } from '@mc/redis';
import { db } from '@mc/db';

// intra-package import — keep these relative
import { scrapeHandler } from './routes/scrape';
```
