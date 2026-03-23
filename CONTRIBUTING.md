# Contributing to DoQuran

Thank you for your interest in contributing. DoQuran is a community platform for Quranic reflection, and we welcome contributions from developers of all backgrounds.

## Getting started

1. **Fork** the repository and clone your fork.
2. Copy the environment file and configure it:
   ```bash
   cp .env.example .env
   ```
3. For local development with SQLite, change the `provider` in `prisma/schema.prisma` from `"postgresql"` to `"sqlite"` and set `DATABASE_URL="file:./dev.db"` in `.env`. Alternatively, use a free [Neon](https://neon.tech) database.
4. Install dependencies and set up the database:
   ```bash
   npm install
   npx prisma db push
   npm run db:seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000).

## Development workflow

- Create a feature branch from `main`: `git checkout -b feat/my-feature`
- Make your changes, keeping commits focused and well-described.
- Run checks before pushing:
  ```bash
  npm run lint
  npx tsc --noEmit
  npm test
  ```
- Open a pull request against `main`. The CI pipeline will run lint, type-check, and tests automatically.

## Code style

- **TypeScript** throughout. No `any` unless absolutely necessary.
- **Tailwind CSS** with the project's design tokens (`var(--dq-*)`) — match the existing visual style.
- **Outfit** for UI text, **Cormorant Garamond** for display headings, **Amiri** for Arabic.
- Prefer server components; use `"use client"` only when interactivity is required.
- Keep diffs focused. Don't include unrelated reformatting or refactoring.

## Commit messages

Write concise commit messages in the imperative mood:
- `Add seal filter to home feed`
- `Fix streak reset on same-day submission`
- `Update profile page OG metadata`

## Reporting issues

Use the GitHub issue templates for bug reports and feature requests. Include reproduction steps for bugs.

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Be respectful, constructive, and welcoming.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
