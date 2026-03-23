# DoQuran

Next.js app: daily Quranic verse (via [Al Quran Cloud](https://alquran.cloud/api)), registered users post reflections on verse ranges, and the community votes.

## Requirements

- Node 20+
- npm (or pnpm/yarn)

## Setup

```bash
cp .env.example .env
# Set JWT_SECRET to a long random string (e.g. openssl rand -hex 32)
npm install
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Purpose |
| -------- | ------- |
| `DATABASE_URL` | Prisma connection string. SQLite example: `file:./dev.db` |
| `JWT_SECRET` | Secret for signing session cookies (required) |
| `RATE_LIMIT_DISABLED` | Set to `true` to turn off in-memory rate limits (e.g. local e2e tests) |

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Development server |
| `npm run build` | Production build (`prisma generate` + `next build`) |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |
| `npm run db:push` | Push Prisma schema to the database |
| `npm run db:studio` | Prisma Studio |

## Production notes

- Use **PostgreSQL** (or another server database) instead of SQLite for multi-instance hosting.
- Rate limiting is **in-process**; for several app servers, use a shared store (e.g. Redis / Upstash) and the same keys.
- Replace placeholder **Privacy** and **Terms** copy with counsel-reviewed documents.
- Configure **HTTPS**, strong `JWT_SECRET`, and trusted **reverse proxy** headers for `X-Forwarded-For` if you rely on IP limits.
- Review **Al Quran Cloud** terms for your use case.

## License

Private / unlicensed unless you add a `LICENSE` file.
