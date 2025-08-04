import dotenv from 'dotenv';
import { existsSync, readdirSync } from 'fs';

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
import { testConnection } from './config/database.js';

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
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:5000", "http://127.0.0.1:5000", "http://localhost:5173", "http://127.0.0.1:5173"],
    },
  },
}));

// Add additional headers for better SPA support
app.use((req, res, next) => {
  // Set headers for SPA routing
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Add CORS headers for better compatibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Set timeout for requests (5 minutes)
  req.setTimeout(300000); // 5 minutes
  res.setTimeout(300000); // 5 minutes

  next();
});

// JSON parsing error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('❌ JSON parsing error:', err.message);
    return res.status(400).json({
      success: false,
      message: 'بيانات غير صحيحة - يرجى التحقق من البيانات المرسلة',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
  next(err);
});
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

// Timeout handling middleware
app.use((req, res, next) => {
  // Set timeout for all requests
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      console.log('⚠️ Request timeout for:', req.path);
      res.status(408).json({
        success: false,
        message: 'طلب مهلة زمنية - يرجى المحاولة مرة أخرى'
      });
    }
  }, 300000); // 5 minutes

  // Clear timeout when response is sent
  res.on('finish', () => {
    clearTimeout(timeout);
  });

  next();
});

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

// Serve static files from the React app (must be after API routes)
app.use(express.static(path.join(process.cwd(), 'client', 'dist')));

// Handle React routing, return all requests to React app
// This must be the LAST route handler
app.get('*', async (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: 'API endpoint not found',
      path: req.path
    });
  }

  // Skip static assets that should be served directly
  if (req.path.startsWith('/assets/') ||
    req.path.startsWith('/images/') ||
    req.path.startsWith('/uploads/') ||
    req.path.includes('.')) {
    return res.status(404).json({
      success: false,
      message: 'Static asset not found',
      path: req.path
    });
  }

  // Serve React app for all other routes (SPA fallback)
  const indexPath = path.join(process.cwd(), 'client', 'dist', 'index.html');

  // Check if the file exists
  if (existsSync(indexPath)) {
    console.log('📄 Serving React app for SPA route:', req.path);

    // Set proper headers for SPA routing
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    // Send the React app with error handling
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('❌ Error serving React app:', err);
        console.error('Failed to serve:', req.path);

        // Send a proper error response instead of leaving it hanging
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Error serving React app',
            path: req.path
          });
        }
      } else {
        console.log('✅ Successfully served React app for:', req.path);
      }
    });
  } else {
    // Fallback for development or production
    console.log('⚠️ React app not found at:', indexPath);
    console.log('📁 Current directory:', process.cwd());

    try {
      const files = readdirSync(process.cwd());
      console.log('📁 Available files:', files);
    } catch (error) {
      console.log('❌ Error reading directory:', error.message);
    }

    // Send a simple HTML response instead of JSON
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>شبابنا - Shababna</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 50px;
              background: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .error { color: #e74c3c; }
            .info { color: #3498db; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>شبابنا - Shababna</h1>
            <p class="error">عذراً، التطبيق غير متاح حالياً</p>
            <p class="info">يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني</p>
            <p>Path: ${req.path}</p>
          </div>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);

  // اختبار الاتصال بقاعدة البيانات
  try {
    const dbConnected = await testConnection();
    if (dbConnected) {
      console.log('✅ Database connection successful');
    } else {
      console.log('⚠️ Database connection failed, but server is running');
    }
  } catch (error) {
    console.error('⚠️ Database connection test failed:', error.message);
    console.log('⚠️ Server is running without database connection');
  }
});