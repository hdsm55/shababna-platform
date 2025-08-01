import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

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
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    'https://shababna-frontend.onrender.com',
    'https://shababna-backend.onrender.com'
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});