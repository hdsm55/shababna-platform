### Production Readiness Audit Report

#### Stack Detection
- Node: enforced >=20.9.0 <21 via package.json engines
- Package manager: npm (package-lock.json present)
- Frontend: Vite + React + TypeScript (client/)
- Backend: Express (server/index.js) ES Modules
- DB: PostgreSQL via pg Pool; SQLite scripts exist but not used in prod
- Payments: Stripe, Iyzico (optional via env)
- Email: SMTP configurable (Gmail/Sendgrid/Mailgun/Outlook)

#### Root Causes of Production Failures
- Hardcoded DB credentials and no DATABASE_URL usage in `server/config/database.js`
- Server binds to default host only and didn’t set trust proxy for Nginx
- Env loading was hardcoded to `env.development` ignoring NODE_ENV
- CORS/CSP not extensible via env; missing ALLOWED_ORIGINS list
- Missing standardized env schema and production example
- No PM2 or Nginx sample configs; unclear prod run steps

#### Fixes Applied
- package.json engines and scripts
  - Added engines.node >=20.9.0 <21 (L1-L10: package.json)
  - Added `start` and `start:prod` (L6-L17: package.json)
- Env management
  - `.env.schema` created with all required variables
  - `.env.production.example` created with sane defaults
- Server
  - `server/index.js`: load env based on NODE_ENV; trust proxy in prod; bind `0.0.0.0`; configurable CORS/CSP via `ALLOWED_ORIGINS`; added `/healthz` endpoint
- Database
  - `server/config/database.js`: prefer `DATABASE_URL`, remove hardcoded creds; SSL configurable
- Ops
  - `scripts/run-prod-local.sh`: build client and run server with NODE_ENV=production
  - `ecosystem.config.cjs`: PM2 cluster config
  - `ops/nginx-staging.conf` and `ops/nginx-prod.conf`: reverse proxy samples and static client serving

File references:
```/workspace/package.json
```
```/workspace/server/index.js
```
```/workspace/server/config/database.js
```
```/workspace/.env.schema
```
```/workspace/.env.production.example
```
```/workspace/scripts/run-prod-local.sh
```
```/workspace/ecosystem.config.cjs
```
```/workspace/ops/nginx-staging.conf
```
```/workspace/ops/nginx-prod.conf
```

#### Local Production Run
1) Copy envs
```bash
cp .env.production.example server/env.production
```
2) Build client
```bash
npm ci
npm --prefix client ci
npm --prefix client run build
```
3) Start server in prod
```bash
npm run start:prod
# or
./scripts/run-prod-local.sh
```
4) Verify
```bash
curl -f http://127.0.0.1:5000/healthz
curl -f http://127.0.0.1:5000/api/health
```

#### Deployment (PM2 + Nginx)
1) Provision server with Node 20.x, Postgres, Nginx
2) Set env at `/var/www/app/server/env.production` or export process envs
3) Build client, deploy `client/dist` to `/var/www/shababna-client/dist`
4) Start with PM2
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 status
```
5) Nginx
 - Copy `ops/nginx-prod.conf` to sites-available, symlink to sites-enabled, reload Nginx
 - Ensure DNS points `api.shaababna.com` and root domain to server

#### Database Migrations
- Use provided SQL in `server/db/schema.sql`. For production, run once:
```bash
node server/db/setup-render-db.js
```
- Recommended: Convert to migration tool (Prisma/Knex) later

#### Checklist Verification
- Local prod build: `npm --prefix client run build` outputs assets in `client/dist`
- Server: binds to `0.0.0.0:${PORT}` and serves static from `client/dist`
- Health endpoints: `/healthz` and `/api/health` return 200
- CORS/CSP: allowlisted via `ALLOWED_ORIGINS`, `CLIENT_URL`, `FRONTEND_URL`, `BACKEND_URL`

#### Notes
- Frontend should consume API via `VITE_API_URL` matching Nginx upstream (e.g., https://api.shaababna.com/api)
- Update `ALLOWED_ORIGINS` as needed
 
