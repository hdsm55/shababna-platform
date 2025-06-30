/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('donations', (table) => {
        // Primary key
        table.increments('id').primary();

        // Foreign keys with cascading deletes
        table.integer('user_id').unsigned().notNullable();
        table.integer('program_id').unsigned().notNullable();

        // Required fields
        table.integer('amount').notNullable();

        // Optional fields
        table.text('message').nullable();

        // Donation timestamp
        table.timestamp('donated_at').defaultTo(knex.fn.now());

        // Foreign key constraints with cascading deletes
        table.foreign('user_id')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');

        table.foreign('program_id')
            .references('id')
            .inTable('programs')
            .onDelete('CASCADE');

        // Indexes for performance
        table.index(['user_id']);
        table.index(['program_id']);
        table.index(['donated_at']);
        table.index(['amount']);

        // Additional useful indexes
        table.index(['program_id', 'donated_at']); // For program donation history
        table.index(['user_id', 'donated_at']); // For user donation history
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTableIfExists('donations');
}