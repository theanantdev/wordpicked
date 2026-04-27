This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Workflow

Use this once on a new machine:

```bash
pnpm run setup:dev
```

Run all quality checks locally before pushing:

```bash
pnpm run check
```

## Supabase Migrations

This repository now includes a Supabase migration scaffold:

- `supabase/config.toml`
- `supabase/migrations/20260407000100_init_schema.sql`

The initial migration creates:

- `public.staff`
- `public.articles`
- `public.exec_sql(sql text)` helper function

Common commands:

```bash
pnpm run db:start
pnpm run db:reset
pnpm run db:stop
```

Create a new migration:

```bash
pnpm run db:migrate:new -- add_some_change
```

Push migrations to a linked Supabase project:

```bash
pnpm run db:login
pnpm run db:link -- --project-ref <your-project-ref>
pnpm run db:push
```

Git hooks:

- `pre-commit`: runs tests
- `pre-push`: runs lint, build, and tests

## CI/CD

GitHub Actions workflows are included:

- CI: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
	- Runs on all pushes and pull requests
	- Executes lint, build, and tests
- CD: [`.github/workflows/cd.yml`](.github/workflows/cd.yml)
	- Runs on pushes to `main` and manual dispatch
	- Deploys to Vercel after checks pass

To enable deployment, add these repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

If those secrets are missing, the CD workflow will skip deployment safely.

## Branch Protection

Set this up in GitHub for the main branch:

1. Go to Settings > Branches > Add branch protection rule.
2. Branch name pattern: `main`.
3. Enable Require a pull request before merging.
4. Enable Require status checks to pass before merging.
5. Select required checks:
	- CI / Lint, Build, Test
6. Enable Require branches to be up to date before merging.
7. Enable Require conversation resolution before merging.
8. Optional but recommended: Restrict who can push to matching branches.
9. Save changes.

Recommended repository settings:

1. Disable force pushes to main.
2. Disable branch deletion for protected branches.
3. Keep direct pushes to the main blocked for non-admins.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details
""
