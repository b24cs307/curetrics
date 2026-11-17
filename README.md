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

## Production
Build with `npm run build`; run the server with `npm --workspace server start`. Deploy the SPA to a static host and the API to a Node host, configure the SPA fallback to `index.html`, and set `CLIENT_URL` to the exact HTTPS origin. Provision managed PostgreSQL, run `npm run db:migrate -- --deploy`, and seed an initial admin once. Use HTTPS, a long random JWT secret, secure cookies, and persistent private storage for resumes. Local upload storage is intended for development; use a private object store behind an authenticated download handler for production. Configure proxy/TLS termination at your host.

## API
Public endpoints: `/api/services`, `/api/jobs`, `/api/jobs/:id`, `/api/applications`, `/api/partnerships`, `/api/social-links`, `/api/support`. Admin endpoints are under `/api/admin`; login and logout use an HTTP-only cookie. The initial dashboard includes service, career, partnership, application, and support management. File uploads accept PDF/DOC/DOCX up to 5 MB and resume downloads require authentication.

Brand logos, social URLs and contact information are intentionally configurable. Add official logo artwork to the client public folder and update settings when supplied. Starter service rows are explicitly unpublished placeholders, not claims about company offerings.
