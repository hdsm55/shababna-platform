/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('events', (table) => {
        // Primary key
        table.increments('id').primary();

        // Required fields
        table.string('title').notNullable();
        table.text('description').notNullable();
        table.datetime('date').notNullable();
        table.string('location').notNullable();

        // Category with enum-like constraint
        table.string('category').notNullable().checkIn(['conference', 'workshop', 'networking']);

        // Optional fields
        table.string('image').nullable(); // URL for event image
        table.integer('max_attendees').nullable();

        // Price with default
        table.integer('price').defaultTo(0);

        // Status with enum-like constraint and default
        table.string('status').defaultTo('active').checkIn(['active', 'cancelled', 'completed']);

        // Timestamps
        table.timestamps(true, true);

        // Indexes for performance
        table.index(['date']);
        table.index(['category']);
        table.index(['status']);

        // Additional useful indexes
        table.index(['date', 'status']); // For filtering active events by date
        table.index(['category', 'status']); // For filtering events by category and status
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTableIfExists('events');
}