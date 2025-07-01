import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
console.log('✅ DB_PASSWORD is:', process.env.DB_PASSWORD);

// Validate required environment variables
const validateDatabaseConfig = () => {
  const requiredVars = {
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER
  };

  for (const [varName, value] of Object.entries(requiredVars)) {
    if (value === undefined || value === null || value === '') {
      throw new Error(
        `❌ Database configuration error: ${varName} is required but not defined or empty.\n` +
        `Please check your .env file and ensure ${varName} is set with a valid value.\n` +
        `Example: ${varName}=your_password_here`
      );
    }

    // Ensure password is always a string
    if (varName === 'DB_PASSWORD' && typeof value !== 'string') {
      throw new Error(
        `❌ Database configuration error: DB_PASSWORD must be a string, but got ${typeof value}.\n` +
        `Please check your .env file and ensure DB_PASSWORD is properly quoted if needed.`
      );
    }
  }
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
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: String(process.env.DB_PASSWORD), // Ensure password is always a string
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
