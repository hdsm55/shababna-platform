import dotenv from 'dotenv';
import knex from 'knex';
import knexfile from '../../knexfile.js';

// Load environment variables
dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const config = knexfile[environment];

// Create and export the database connection
const db = knex(config);

// Test the connection
db.raw('SELECT 1')
    .then(() => {
        console.log('✅ Database connection established successfully');
    })
    .catch((error) => {
        console.error('❌ Database connection failed:', error.message);
        // Don't crash the server, just log the error
        console.log('⚠️  Server will continue without database connection');
    });

export default db;