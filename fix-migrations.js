import knex from 'knex';
import knexfile from './knexfile.js';

const db = knex(knexfile.development);

async function fixMigrations() {
    try {
        console.log('🔧 Fixing migration status...');

        // Check if knex_migrations table exists
        const tableExists = await db.schema.hasTable('knex_migrations');

        if (!tableExists) {
            console.log('📋 Creating knex_migrations table...');
            await db.schema.createTable('knex_migrations', (table) => {
                table.increments('id').primary();
                table.string('name');
                table.integer('batch');
                table.timestamp('migration_time');
            });
        }

        // List of migration files that should be marked as completed
        const migrations = [
            '001_create_users_table.js',
            '002_create_events_table.js',
            '003_create_programs_table.js',
            '004_create_registrations_table.js',
            '005_create_donations_table.js'
        ];

        // Get the next batch number
        const maxBatch = await db('knex_migrations').max('batch as maxBatch').first();
        const nextBatch = (maxBatch?.maxBatch || 0) + 1;

        console.log(`📦 Marking migrations as completed in batch ${nextBatch}...`);

        // Insert all migrations as completed
        for (const migration of migrations) {
            await db('knex_migrations').insert({
                name: migration,
                batch: nextBatch,
                migration_time: new Date()
            });
            console.log(`✅ Marked ${migration} as completed`);
        }

        console.log('🎉 Migration status fixed successfully!');
        console.log('📊 You can now run: npm run db:seed');

    } catch (error) {
        console.error('❌ Error fixing migrations:', error.message);
    } finally {
        await db.destroy();
    }
}

fixMigrations();