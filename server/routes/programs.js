import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Programs API routes
const programs = [
  {
    id: 1,
    title: 'Future Leaders Initiative',
    description: 'A comprehensive 6-month program designed to develop leadership skills.',
    duration: '6 months',
    participants: 50,
    maxParticipants: 60,
    category: 'Leadership',
    image: 'https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg',
    goals: [
      'Develop advanced leadership skills',
      'Build strategic thinking capabilities',
      'Create impactful community projects',
      'Network with global leaders'
    ],
    impact: 'Over 500 graduates leading initiatives worldwide',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    title: 'Digital Innovation Academy',
    description: 'An intensive program focusing on emerging technologies.',
    duration: '4 months',
    participants: 30,
    maxParticipants: 35,
    category: 'Technology',
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
    goals: [
      'Master emerging technologies',
      'Develop innovative solutions',
      'Build tech startups',
      'Connect with industry experts'
    ],
    impact: '12 successful startups launched by alumni',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Get all programs
router.get('/', (req, res) => {
  try {
    const { category, search, limit = 10, offset = 0 } = req.query;

    let filteredPrograms = [...programs];

    if (category && category !== 'all') {
      filteredPrograms = filteredPrograms.filter(program =>
        program.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredPrograms = filteredPrograms.filter(program =>
        program.title.toLowerCase().includes(searchLower) ||
        program.description.toLowerCase().includes(searchLower)
      );
    }

    const paginatedPrograms = filteredPrograms.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit)
    );

    res.json({
      programs: paginatedPrograms,
      total: filteredPrograms.length,
      hasMore: parseInt(offset) + parseInt(limit) < filteredPrograms.length
    });
  } catch (error) {
    console.error('Get programs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single program
router.get('/:id', (req, res) => {
  try {
    const program = programs.find(p => p.id === parseInt(req.params.id));
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.json(program);
  } catch (error) {
    console.error('Get program error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Support program
router.post('/:id/support', [
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('email').isEmail().normalizeEmail(),
  body('supportType').isIn(['volunteer', 'donate', 'sponsor']),
  body('message').optional().trim()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const program = programs.find(p => p.id === parseInt(req.params.id));
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    // In a real app, you'd save the support request to database
    res.json({
      message: 'Support request submitted successfully',
      program: {
        id: program.id,
        title: program.title
      }
    });
  } catch (error) {
    console.error('Program support error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;