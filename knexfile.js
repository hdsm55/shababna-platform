import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
console.log('✅ DB_PASSWORD is:', process.env.DB_PASSWORD);
console.log('DB_USER=', process.env.DB_USER);
console.log('DB_PASSWORD=', process.env.DB_PASSWORD);

// Validate required environment variables
const validateDatabaseConfig = () => {
  // Set default values for local development if .env is not present
  const config = {
    DB_NAME: process.env.DB_NAME || 'shababna',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || ''
  };

  // Only validate if we're in production or if specific values are provided
  if (process.env.NODE_ENV === 'production') {
    if (!config.DB_NAME || !config.DB_USER || !config.DB_PASSWORD) {
      throw new Error(
        `❌ Production database configuration error: All database variables are required in production.\n` +
        `Please set DB_NAME, DB_USER, and DB_PASSWORD in your .env file.`
      );
    }
  }

  // Validate password type if provided
  if (config.DB_PASSWORD !== undefined && typeof config.DB_PASSWORD !== 'string') {
    throw new Error(
      `❌ Database configuration error: DB_PASSWORD must be a string, but got ${typeof config.DB_PASSWORD}.\n` +
      `Please check your .env file and ensure DB_PASSWORD is properly quoted if needed.`
    );
  }

  console.log('✅ Database configuration validated successfully');
  console.log(`📊 Using database: ${config.DB_NAME} on ${config.DB_USER}@${process.env.DB_HOST || 'localhost'}`);
};

// Validate configuration before exporting
try {
  validateDatabaseConfig();
  console.log('✅ Database configuration validated successfully');
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

export default {
  development: {
    client: process.env.DB_CLIENT || 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'shababna',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '', // Allow empty password for local dev
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    },
    migrations: {
      directory: './server/db/migrations'
    },
    seeds: {
      directory: './server/db/seeds'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
