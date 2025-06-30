/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    // Clear existing data
    await knex('donations').del();

    // Get existing users and programs for foreign keys
    const users = await knex('users').select('id');
    const programs = await knex('programs').select('id');

    if (users.length === 0 || programs.length === 0) {
        console.log('⚠️  Skipping donations seed - no users or programs found');
        return;
    }

    const donations = [];
    const donationMessages = [
        'May Allah accept this donation and bless you abundantly.',
        'In the name of Allah, the Most Gracious, the Most Merciful.',
        'For the sake of Allah and to help those in need.',
        'May this donation bring benefit to the community.',
        'Supporting Islamic education and community development.',
        'Helping to spread the message of Islam.',
        'For the betterment of our youth and future generations.',
        'Supporting relief efforts for those in need.',
        'May Allah reward you for your generosity.',
        'Contributing to the growth of our Islamic community.'
    ];

    // Create donations for each user to different programs
    users.forEach((user, userIndex) => {
        // Each user makes 1-4 donations
        const numDonations = Math.min(1 + (userIndex % 4), programs.length);

        for (let i = 0; i < numDonations; i++) {
            const programIndex = (userIndex + i) % programs.length;

            // Generate realistic donation amounts (50-2000 SAR)
            const amount = Math.floor(Math.random() * 1950) + 50;

            // Random donation message
            const message = donationMessages[Math.floor(Math.random() * donationMessages.length)];

            donations.push({
                user_id: user.id,
                program_id: programs[programIndex].id,
                amount: amount,
                message: message,
                donated_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random time within last 30 days
            });
        }
    });

    if (donations.length > 0) {
        await knex('donations').insert(donations);
        console.log(`✅ ${donations.length} donations seed data inserted successfully`);

        // Update current_amount in programs table based on donations
        const programTotals = await knex('donations')
            .select('program_id')
            .sum('amount as total')
            .groupBy('program_id');

        for (const total of programTotals) {
            await knex('programs')
                .where('id', total.program_id)
                .update({ current_amount: total.total });
        }

        console.log('✅ Program current amounts updated based on donations');
    } else {
        console.log('⚠️  No donations created');
    }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function unseed(knex) {
    await knex('donations').del();
    console.log('🗑️ Donations seed data removed');
}