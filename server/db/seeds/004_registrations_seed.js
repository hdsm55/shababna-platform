/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    // Clear existing data
    await knex('registrations').del();

    // Get existing users and events for foreign keys
    const users = await knex('users').select('id');
    const events = await knex('events').select('id');

    if (users.length === 0 || events.length === 0) {
        console.log('⚠️  Skipping registrations seed - no users or events found');
        return;
    }

    const registrations = [];

    // Create registrations for each user to different events
    users.forEach((user, userIndex) => {
        // Each user registers for 1-3 events
        const numRegistrations = Math.min(1 + (userIndex % 3), events.length);

        for (let i = 0; i < numRegistrations; i++) {
            const eventIndex = (userIndex + i) % events.length;

            registrations.push({
                user_id: user.id,
                event_id: events[eventIndex].id,
                registered_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time within last 7 days
            });
        }
    });

    if (registrations.length > 0) {
        await knex('registrations').insert(registrations);
        console.log(`✅ ${registrations.length} registrations seed data inserted successfully`);
    } else {
        console.log('⚠️  No registrations created');
    }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function unseed(knex) {
    await knex('registrations').del();
    console.log('🗑️ Registrations seed data removed');
}