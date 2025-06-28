/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('phone').nullable();
        table.text('bio').nullable();
        table.string('avatar_url').nullable();
        table.boolean('is_active').defaultTo(true);
        table.boolean('is_admin').defaultTo(false);
        table.timestamp('email_verified_at').nullable();
        table.timestamps(true, true);

        // Indexes
        table.index(['email']);
        table.index(['is_active']);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    return knex.schema.dropTableIfExists('users');
}