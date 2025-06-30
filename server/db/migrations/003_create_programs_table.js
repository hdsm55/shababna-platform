/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('programs', (table) => {
        // Primary key
        table.increments('id').primary();

        // Required fields
        table.string('title').notNullable();
        table.text('description').notNullable();

        // Category with enum-like constraint and default
        table.string('category').defaultTo('education').checkIn(['education', 'relief', 'youth', 'media', 'daawah']);

        // Optional fields
        table.string('image').nullable(); // URL for program image

        // Financial fields
        table.integer('goal_amount').nullable();
        table.integer('current_amount').defaultTo(0);

        // Status field
        table.boolean('is_active').defaultTo(true);

        // Timestamps
        table.timestamps(true, true);

        // Indexes for performance
        table.index(['category']);
        table.index(['is_active']);

        // Additional useful indexes
        table.index(['category', 'is_active']); // For filtering active programs by category
        table.index(['is_active', 'goal_amount']); // For sorting active programs by goal amount
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTableIfExists('programs');
}