/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    // Clear existing data
    await knex('events').del();

    // Get current date for creating future events
    const now = new Date();
    const futureDate1 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const futureDate2 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
    const futureDate3 = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000); // 21 days from now

    // Insert seed data
    await knex('events').insert([
        {
            title: 'Tech Conference 2024',
            description: 'Join us for the biggest technology conference of the year. Learn about the latest trends in AI, blockchain, and cloud computing.',
            date: futureDate1,
            location: 'Riyadh Convention Center',
            category: 'conference',
            image: 'https://example.com/images/tech-conference.jpg',
            max_attendees: 500,
            price: 150,
            status: 'active',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'Web Development Workshop',
            description: 'Hands-on workshop covering modern web development techniques including React, Node.js, and database design.',
            date: futureDate2,
            location: 'Jeddah Innovation Hub',
            category: 'workshop',
            image: 'https://example.com/images/web-dev-workshop.jpg',
            max_attendees: 30,
            price: 75,
            status: 'active',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'Startup Networking Event',
            description: 'Connect with fellow entrepreneurs, investors, and industry experts. Great opportunity to expand your network.',
            date: futureDate3,
            location: 'Dhahran Business District',
            category: 'networking',
            image: 'https://example.com/images/networking-event.jpg',
            max_attendees: 100,
            price: 0,
            status: 'active',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'AI and Machine Learning Summit',
            description: 'Explore the future of artificial intelligence with leading experts in the field.',
            date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            location: 'King Abdullah University',
            category: 'conference',
            image: 'https://example.com/images/ai-summit.jpg',
            max_attendees: 300,
            price: 200,
            status: 'active',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'Mobile App Development Bootcamp',
            description: 'Intensive 3-day bootcamp covering iOS and Android app development from scratch.',
            date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
            location: 'Dammam Tech Campus',
            category: 'workshop',
            image: 'https://example.com/images/mobile-bootcamp.jpg',
            max_attendees: 25,
            price: 120,
            status: 'active',
            created_at: new Date(),
            updated_at: new Date()
        }
    ]);

    console.log('✅ Events seed data inserted successfully');
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function unseed(knex) {
    await knex('events').del();
    console.log('🗑️ Events seed data removed');
}