# CureTrics

Responsive corporate website and admin portal backed by a REST API and PostgreSQL/Prisma.

## Requirements
Node.js 20+, npm, and PostgreSQL 14+. Copy `.env.example` to `.env`, set a strong `JWT_SECRET` and `ADMIN_PASSWORD`, and set `DATABASE_URL` to your PostgreSQL database.

## Local development
1. `npm install`
2. Copy `.env.example` to `.env` and configure `DATABASE_URL` for your local PostgreSQL instance.
3. `npm run db:generate` (also runs automatically before `npm run dev`)
4. `npm run db:migrate -- --name init`
5. `npm run db:seed`
6. `npm run dev` (web at http://localhost:5173, API at http://localhost:4000)

The seed command creates the first admin from environment variables and safe, unpublished starter service entries. There is no public admin registration. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` before seeding. The dev preflight uses the Prisma engine already installed in `node_modules`, so generating the client does not require a separate engine download.

To email career-interest submissions, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, and `CAREERS_EMAIL_TO` in the server environment. `SMTP_FROM` must be allowed by your SMTP provider. Keep credentials out of source control. Without these settings, the endpoint returns a configuration error instead of reporting a successful email.

## Production and Vercel
The repository root is configured as one Vercel project: Vite builds to `client/dist`, while `api/[...path].ts` forwards `/api/*` requests to the Express API. In Vercel Project Settings, set **Root Directory** to the repository root (`.`); use `npm install` for installation and `npm run build` for the build command. The output directory is configured in the root `vercel.json`.

Configure these Vercel environment variables before deploying:
- `DATABASE_URL`: connection string for managed PostgreSQL. Use the provider's pooled connection string where available.
- `JWT_SECRET`: a long random secret of at least 32 characters.
- `CLIENT_URL`: the exact HTTPS origin of the deployment.
- `BLOB_READ_WRITE_TOKEN`: required for private resume storage; local filesystem storage is not persistent on Vercel.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, and `CAREERS_EMAIL_TO`: required to deliver career-interest emails.

Run `npm run db:deploy` once against the production database, and run `npm run db:seed` once if an initial admin account is needed. The build generates the Prisma client automatically. Do not store secrets in source control.

## API
Public endpoints: `/api/services`, `/api/jobs`, `/api/jobs/:id`, `/api/applications`, `/api/career-interest`, `/api/partnerships`, `/api/social-links`, `/api/support`. Admin endpoints are under `/api/admin`; login and logout use an HTTP-only cookie. The initial dashboard includes service, career, partnership, application, and support management. File uploads accept PDF/DOC/DOCX up to 5 MB and resume downloads require authentication.

Brand logos, social URLs and contact information are intentionally configurable. Add official logo artwork to the client public folder and update settings when supplied. Starter service rows are explicitly unpublished placeholders, not claims about company offerings.
