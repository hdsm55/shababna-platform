# Database Setup Guide

## PostgreSQL Configuration

To set up the database connection, create a `.env` file in the root directory with the following variables:

```env
# Database Configuration (PostgreSQL)
DB_CLIENT=pg
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shababna
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# API Configuration
API_URL=http://localhost:5001/api
```

## Required Steps

1. **Create PostgreSQL Database:**

   ```sql
   CREATE DATABASE shababna;
   ```

2. **Create .env file** with the above configuration

3. **Install PostgreSQL dependencies** (if not already installed):

   ```bash
   npm install pg
   ```

4. **Run migrations:**

   ```bash
   npm run db:migrate
   ```

5. **Run seeds:**
   ```bash
   npm run db:seed
   ```

## Validation Features

The updated `knexfile.js` now includes:

- ✅ **Password validation**: Ensures `DB_PASSWORD` is defined and is a string
- ✅ **Required variables validation**: Checks `DB_NAME`, `DB_USER`, and `DB_PASSWORD`
- ✅ **Clear error messages**: Provides helpful guidance when configuration is missing
- ✅ **Type safety**: Ensures password is always converted to string
- ✅ **SSL configuration**: Automatically configured for production environments
- ✅ **Connection pooling**: Optimized for better performance

## Error Resolution

If you see the error:

```
❌ Database configuration error: DB_PASSWORD is required but not defined or empty.
```

1. Create a `.env` file in the project root
2. Add the required environment variables as shown above
3. Replace `your_postgres_password_here` with your actual PostgreSQL password
4. Run the migration command again
