### Monorepo for the websites
* [inesimdahl.de](https://inesimdahl.de) — `apps/ines-portfolio`
* [lönneker.de](https://lönneker.de) — `apps/jens-portfolio`

Shared pages, components and utilities live in `packages/shared`.

## Development

Requires Node (version in `.nvmrc`) and pnpm (version in `packageManager`; `corepack enable` provides it).

```sh
pnpm install --frozen-lockfile
cp .env.example apps/ines-portfolio/.env.local   # then fill in real values
pnpm dev:1        # or dev:2 for jens-portfolio
pnpm lint         # ESLint in both apps
pnpm test         # Vitest in packages/shared, Supabase is mocked
pnpm build        # builds both apps
```

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Public anon key (shipped to the browser) |
| `VITE_SUPABASE_USER_ID` | Owner whose `content` rows the site shows |

CI (`.github/workflows/ci.yml`) runs install, lint, test and build with the placeholder values from `.env.example`; it needs no secrets.

## Which content a site shows

Every list and the detail page (`ContentDetail`) filter `content` by `user_id = VITE_SUPABASE_USER_ID`, so one site never renders another site's entry, even by guessing an id. A missing, foreign or failed entry shows a "not found" page. Without a configured site id nothing is queried.

This is a presentation filter in app code, not access control: the anon key is public and the database itself decides what it returns. Whether Row Level Security on `content` only allows reading published rows is configured in Supabase and is not verified by this repository.
