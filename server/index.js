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
import './config/database-sqlite.js';

// Import routes
import authRoutes from './routes/auth.js';
import eventsRoutes from './routes/events.js';
import programsRoutes from './routes/programs.js';
import usersRoutes from './routes/users.js';
import paymentsRoutes from './routes/payments.js';
import volunteersRoutes from './routes/volunteers.js';
import formsRoutes from './routes/forms.js';
import dashboardRoutes from './routes/dashboard.js';
import errorHandler from './middleware/errorHandler.js';
import blogsRoutes from './routes/blogs.js';

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
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    process.env.CORS_ORIGIN,
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
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
app.use('/api/payments', paymentsRoutes);
app.use('/api/volunteers', volunteersRoutes);
app.use('/api/forms', formsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/blogs', blogsRoutes);

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
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5174'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please try a different port or kill the process using it.`);
    console.error(`💡 Try: netstat -ano | findstr :${PORT} then taskkill /PID <PID> /F`);
  } else {
    console.error('❌ Server failed to start:', err.message);
  }
  process.exit(1);
});