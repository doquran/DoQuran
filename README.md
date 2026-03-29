# DoQuran

A community platform where modern professionals engage with the Qur'an through daily reflections, perspective seals, and peer recognition.

One verse a day — Arabic and English — then your reflection, tagged by lens: scientist, engineer, physician, educator, scholar. The community votes. The best work rises.

## Features

- **Daily verse** — Arabic text and Sahih International translation via [Al Quran Cloud](https://alquran.cloud/api)
- **Perspective seals** — tag reflections as Scientist, Engineer, Physician, Educator, Scholar, or Seeker
- **Community voting** — upvote and downvote reflections; scores drive visibility
- **Progression system** — per-seal tiers (Rising / Established / Distinguished) and overall levels (Newcomer through Pillar)
- **Streaks** — consecutive-day contribution tracking
- **Shareable profiles** — public profile pages with stats, seal progress, and share button
- **Email verification** and **password reset** flows
- **Admin moderation queue** — review and action community reports
- **Rate limiting** — Upstash Redis in production, in-memory fallback for local dev
- **Error monitoring** — Sentry integration (optional)

## Tech stack

- **Framework**: Next.js 16 (App Router, Server Components, ISR)
- **Database**: PostgreSQL via Prisma (Neon recommended)
- **Auth**: JWT cookies (bcrypt + jose)
- **Email**: Resend
- **Rate limiting**: Upstash Redis
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Fonts**: Outfit (UI), Cormorant Garamond (display), Amiri (Arabic)
- **Testing**: Vitest
- **CI**: GitHub Actions

## Quick start

```bash
git clone https://github.com/doquran/DoQuran.git
cd DoQuran
cp .env.example .env
```

### Option A: Local SQLite (simplest)

1. Change `provider` in `prisma/schema.prisma` from `"postgresql"` to `"sqlite"`.
2. Set `DATABASE_URL="file:./dev.db"` in `.env`.
3. Set `JWT_SECRET` to any long random string.

### Option B: Neon Postgres (recommended)

1. Create a free database at [neon.tech](https://neon.tech).
2. Copy the pooled connection string into `DATABASE_URL` in `.env`.
3. Set `JWT_SECRET` to a secure random string:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
   ```

### Then:

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Postgres connection string (or SQLite path for local dev) |
| `JWT_SECRET` | Yes | Secret for signing session cookies |
| `RESEND_API_KEY` | No | Resend API key for email; logs to console when absent |
| `MAIL_FROM` | No | Sender address (default: `onboarding@resend.dev`) |
| `UPSTASH_REDIS_REST_URL` | No | Upstash Redis URL for rate limiting; falls back to in-memory |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash Redis token |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry DSN for error monitoring |
| `NEXT_PUBLIC_BASE_URL` | No | Public URL for email links and social sharing |
| `RATE_LIMIT_DISABLED` | No | Set to `true` to bypass rate limits in tests |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:seed` | Seed perspective badge catalog |
| `npm run db:studio` | Prisma Studio (database GUI) |

## Deploying to Vercel

1. Push the repository to GitHub.
2. Import the project on [vercel.com](https://vercel.com).
3. Set environment variables in the Vercel dashboard (see table above).
4. Deploy. Vercel handles HTTPS, CDN, and serverless functions automatically.

### Recommended production services (all have free tiers)

- **Database**: [Neon](https://neon.tech) — Postgres with connection pooling and autoscaling
- **Email**: [Resend](https://resend.com) — 100 emails/day free
- **Rate limiting**: [Upstash](https://upstash.com) — Redis with 10,000 requests/day free
- **Monitoring**: [Sentry](https://sentry.io) — 5,000 errors/month free

## Project structure

```
prisma/
  schema.prisma          # Database schema
  seed.ts                # Badge catalog seeder
  seed-progress.ts       # Backfill script for seal progress + streaks
src/
  app/                   # Next.js App Router pages and API routes
    api/                 # REST API endpoints
    admin/               # Admin moderation pages
    profile/[id]/        # Public user profiles
    ...
  components/            # React components (server + client)
  lib/                   # Shared utilities (auth, badges, levels, mail, etc.)
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions, coding standards, and the PR process.

## License

[MIT](LICENSE)
