/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    // Clear existing data
    await knex('programs').del();

    // Insert seed data
    await knex('programs').insert([
        {
            title: 'Islamic Education for Youth',
            description: 'Comprehensive Islamic education program designed specifically for young Muslims. Covers Quran memorization, Islamic history, and contemporary Islamic issues.',
            category: 'education',
            image: 'https://example.com/images/islamic-education.jpg',
            goal_amount: 50000,
            current_amount: 25000,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'Emergency Relief Fund',
            description: 'Providing immediate assistance to families affected by natural disasters and emergencies. Includes food, shelter, and medical aid.',
            category: 'relief',
            image: 'https://example.com/images/emergency-relief.jpg',
            goal_amount: 100000,
            current_amount: 75000,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'Youth Leadership Development',
            description: 'Empowering young Muslims to become leaders in their communities through leadership training, mentorship, and community service projects.',
            category: 'youth',
            image: 'https://example.com/images/youth-leadership.jpg',
            goal_amount: 30000,
            current_amount: 15000,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'Islamic Media Production',
            description: 'Creating high-quality Islamic content for digital platforms including videos, podcasts, and social media content to spread Islamic knowledge.',
            category: 'media',
            image: 'https://example.com/images/islamic-media.jpg',
            goal_amount: 40000,
            current_amount: 20000,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'Dawah Training Program',
            description: 'Training volunteers in effective dawah methods, Islamic communication skills, and how to present Islam in a positive and engaging way.',
            category: 'daawah',
            image: 'https://example.com/images/dawah-training.jpg',
            goal_amount: 25000,
            current_amount: 12000,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'Quran Memorization Center',
            description: 'Establishing centers for Quran memorization and tajweed training for all age groups, with qualified teachers and modern learning facilities.',
            category: 'education',
            image: 'https://example.com/images/quran-center.jpg',
            goal_amount: 80000,
            current_amount: 45000,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'Orphan Support Program',
            description: 'Providing comprehensive support for orphaned children including education, healthcare, and emotional support to ensure they have a bright future.',
            category: 'relief',
            image: 'https://example.com/images/orphan-support.jpg',
            goal_amount: 60000,
            current_amount: 35000,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'Women Empowerment Initiative',
            description: 'Supporting Muslim women through education, skill development, and entrepreneurship training to help them become financially independent.',
            category: 'youth',
            image: 'https://example.com/images/women-empowerment.jpg',
            goal_amount: 35000,
            current_amount: 18000,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'Islamic Podcast Network',
            description: 'Creating a network of Islamic podcasts covering various topics including fiqh, history, contemporary issues, and personal development.',
            category: 'media',
            image: 'https://example.com/images/podcast-network.jpg',
            goal_amount: 20000,
            current_amount: 8000,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'Interfaith Dialogue Program',
            description: 'Organizing interfaith dialogue sessions to promote understanding and cooperation between different religious communities.',
            category: 'daawah',
            image: 'https://example.com/images/interfaith-dialogue.jpg',
            goal_amount: 15000,
            current_amount: 5000,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
        }
    ]);

    console.log('✅ Programs seed data inserted successfully');
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function unseed(knex) {
    await knex('programs').del();
    console.log('🗑️ Programs seed data removed');
}