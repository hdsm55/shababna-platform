/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('registrations', (table) => {
        // Primary key
        table.increments('id').primary();

        // Foreign keys with cascading deletes
        table.integer('user_id').unsigned().notNullable();
        table.integer('event_id').unsigned().notNullable();

        // Registration timestamp
        table.timestamp('registered_at').defaultTo(knex.fn.now());

        // Foreign key constraints with cascading deletes
        table.foreign('user_id')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');

        table.foreign('event_id')
            .references('id')
            .inTable('events')
            .onDelete('CASCADE');

        // Unique composite key to prevent duplicate registrations
        table.unique(['user_id', 'event_id']);

        // Indexes for performance
        table.index(['user_id']);
        table.index(['event_id']);
        table.index(['registered_at']);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTableIfExists('registrations');
}