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
PORT=5001
CLIENT_URL=http://localhost:5173

# Database Configuration (PostgreSQL)
DB_CLIENT=pg
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shababna
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# API Configuration
API_URL=http://localhost:5001/api
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

1. Create `.env` file with PostgreSQL configuration
2. Create PostgreSQL database: `CREATE DATABASE shababna;`
3. Run migrations: `npm run db:migrate`
4. Run seeds: `npm run db:seed`
5. Start the development server: `npm run dev`

## Database Connection

The database connection is configured in `server/config/database.js` and uses the environment variables from your `.env` file.

For development, the configuration uses PostgreSQL with proper connection pooling and SSL support for production environments.
