import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { query } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupDatabase() {
    try {
        console.log('🚀 Setting up database...');

        // Read schema file
        const schemaPath = join(__dirname, 'schema.sql');
        const schema = readFileSync(schemaPath, 'utf8');

        // Execute schema
        console.log('📋 Creating tables...');
        await query(schema);
        console.log('✅ Tables created successfully');

        // Read and execute seed data
        const seedPath = join(__dirname, 'events_seed.sql');
        const seedData = readFileSync(seedPath, 'utf8');

        console.log('🌱 Seeding events data...');
        await query(seedData);
        console.log('✅ Events data seeded successfully');

        console.log('🎉 Database setup completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        process.exit(1);
    }
}

setupDatabase();