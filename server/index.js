import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Set NODE_ENV to development for local development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';
import bodyParser from 'body-parser';

// Import database configuration
import './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import eventsRoutes from './routes/events.js';
import programsRoutes from './routes/programs.js';
import usersRoutes from './routes/users.js';
// إزالة أو تعطيل استيراد donations.js
// import donationsRoutes from './routes/donations.js';
import formsRoutes from './routes/forms.js';
import dashboardRoutes from './routes/dashboard.js';
import errorHandler from './middleware/errorHandler.js';
import blogsRoutes from './routes/blogs.js';
import newsletterRoutes from './routes/newsletter.js';
import paymentsRoutes from './routes/payments.js';
import volunteersRoutes from './routes/volunteers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // تعطيل CSP مؤقتاً للتطوير
}));
// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      process.env.CLIENT_URL,
      process.env.FRONTEND_URL,
      'https://shababna-frontend.onrender.com',
      'https://shababna-backend.onrender.com',
      'https://shababna-platform-1.onrender.com',
      'https://shababna-platform.onrender.com'
    ].filter(Boolean);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// جعل مجلد uploads متاحاً للقراءة عبر HTTP
app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/programs', programsRoutes);
app.use('/api/users', usersRoutes);
// إزالة أو تعطيل استيراد donations.js
// app.use('/api/donations', donationsRoutes);
app.use('/api/forms', formsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/volunteers', volunteersRoutes);

// Additional routes for dashboard data
app.use('/api/contact-forms', formsRoutes);
app.use('/api/join-requests', formsRoutes);
app.use('/api/program-registrations', formsRoutes);
app.use('/api/event-registrations', formsRoutes);

// Error handling middleware
app.use(errorHandler);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Shababna Global API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Serve static files from the React app
app.use(express.static(path.join(process.cwd(), 'client', 'dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'client', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});