import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Mock events database
const events = [
  {
    id: 1,
    title: 'Youth Leadership Summit 2024',
    description: 'A comprehensive summit bringing together young leaders from around the world.',
    date: '2024-03-15T10:00:00Z',
    location: 'Istanbul, Turkey',
    category: 'conference',
    attendees: 150,
    maxAttendees: 200,
    price: 0,
    image: 'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    title: 'Digital Marketing Workshop',
    description: 'Learn essential digital marketing skills including social media strategy.',
    date: '2024-02-20T14:00:00Z',
    location: 'Dubai, UAE',
    category: 'workshop',
    attendees: 50,
    maxAttendees: 60,
    price: 25,
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Get all events
router.get('/', (req, res) => {
  try {
    const { category, search, limit = 10, offset = 0 } = req.query;
    
    let filteredEvents = [...events];
    
    if (category && category !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower)
      );
    }
    
    const paginatedEvents = filteredEvents.slice(
      parseInt(offset), 
      parseInt(offset) + parseInt(limit)
    );
    
    res.json({
      events: paginatedEvents,
      total: filteredEvents.length,
      hasMore: parseInt(offset) + parseInt(limit) < filteredEvents.length
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single event
router.get('/:id', (req, res) => {
  try {
    const event = events.find(e => e.id === parseInt(req.params.id));
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create event (admin only)
router.post('/', [
  body('title').trim().isLength({ min: 1 }),
  body('description').trim().isLength({ min: 10 }),
  body('date').isISO8601(),
  body('location').trim().isLength({ min: 1 }),
  body('category').isIn(['workshop', 'conference', 'networking']),
  body('maxAttendees').isInt({ min: 1 })
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newEvent = {
      id: events.length + 1,
      ...req.body,
      attendees: 0,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    events.push(newEvent);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register for event
router.post('/:id/register', [
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').optional().trim()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = events.find(e => e.id === parseInt(req.params.id));
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.attendees >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // In a real app, you'd save the registration to database
    event.attendees += 1;
    event.updatedAt = new Date();

    res.json({ 
      message: 'Registration successful',
      event: {
        id: event.id,
        title: event.title,
        date: event.date,
        location: event.location
      }
    });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;