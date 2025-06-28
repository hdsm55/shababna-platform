import bcrypt from 'bcryptjs';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    // Clear existing data
    await knex('users').del();

    // Hash password for admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Insert seed data
    await knex('users').insert([
        {
            email: 'admin@shababna.com',
            password: hashedPassword,
            first_name: 'Admin',
            last_name: 'User',
            phone: '+966501234567',
            bio: 'System Administrator',
            is_active: true,
            is_admin: true,
            email_verified_at: new Date(),
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            email: 'user@shababna.com',
            password: hashedPassword,
            first_name: 'Regular',
            last_name: 'User',
            phone: '+966507654321',
            bio: 'Regular platform user',
            is_active: true,
            is_admin: false,
            email_verified_at: new Date(),
            created_at: new Date(),
            updated_at: new Date()
        }
    ]);

    console.log('✅ Users seed data inserted successfully');
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function unseed(knex) {
    await knex('users').del();
    console.log('🗑️ Users seed data removed');
}