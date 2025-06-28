# Database Configuration

This directory contains the database configuration, migrations, and seeds for the Shababna Global Platform.

## Structure

```
server/db/
├── migrations/     # Database migration files
├── seeds/         # Database seed files
└── README.md      # This file
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Development Environment Configuration
NODE_ENV=development

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:5173

# Database Configuration (Development)
DB_CLIENT=sqlite3
DB_FILENAME=./server/db/dev.sqlite3

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

## Database Commands

### Migrations

- **Run migrations**: `npm run db:migrate`
- **Rollback migrations**: `npm run db:migrate:rollback`

### Seeds

- **Run all seeds**: `npm run db:seed`
- **Run specific seed**: `npm run db:seed:rollback` (runs users seed)
- **Reset database**: `npm run db:reset` (rollback + migrate + seed)

## Development Setup

1. Copy `.env.example` to `.env` and configure your environment variables
2. Run migrations: `npm run db:migrate`
3. Run seeds: `npm run db:seed`
4. Start the development server: `npm run dev`

## Database Connection

The database connection is configured in `server/config/database.js` and uses the environment variables from your `.env` file.

For development, the default configuration uses SQLite3 with the database file located at `server/db/dev.sqlite3`.
