import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';

// Import database configuration
import './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import eventsRoutes from './routes/events.js';
import programsRoutes from './routes/programs.js';
import usersRoutes from './routes/users.js';
import donationsRoutes from './routes/donations.js';
import formsRoutes from './routes/forms.js';
import dashboardRoutes from './routes/dashboard.js';
import errorHandler from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:5000", "http://localhost:5173"],
    },
  },
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// جعل مجلد uploads متاحاً للقراءة عبر HTTP
app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/programs', programsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/forms', formsRoutes);
app.use('/api/dashboard', dashboardRoutes);

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