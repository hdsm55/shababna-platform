import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

// Rate limiting configuration
export const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
    return rateLimit({
        windowMs,
        max, // Limit each IP to 100 requests per windowMs
        message: {
            success: false,
            message: 'Too many requests from this IP, please try again later.',
            code: 'RATE_LIMIT_EXCEEDED'
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// Specific rate limits for different endpoints
export const authRateLimit = createRateLimit(15 * 60 * 1000, 5); // 5 attempts per 15 minutes for auth
export const apiRateLimit = createRateLimit(15 * 60 * 1000, 100); // 100 requests per 15 minutes for API
export const uploadRateLimit = createRateLimit(60 * 60 * 1000, 10); // 10 uploads per hour

// Security headers configuration
export const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "http://localhost:5000", "http://127.0.0.1:5000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "https://shababna-platform.onrender.com", "https://*.onrender.com", "https://*.render.com", "https://*.googleapis.com", "https://*.gstatic.com"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
});

// CORS configuration
export const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            process.env.CLIENT_URL || 'http://localhost:5173',
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:5176',
            'https://shababna.org',
            'https://www.shababna.org'
        ];

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Input validation middleware
export const validateInput = (schema) => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    details: error.details.map(detail => detail.message),
                    code: 'VALIDATION_ERROR'
                });
            }
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Validation middleware error',
                code: 'VALIDATION_MIDDLEWARE_ERROR'
            });
        }
    };
};

// File upload security middleware
export const fileUploadSecurity = (req, res, next) => {
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (req.file && req.file.size > maxSize) {
        return res.status(400).json({
            success: false,
            message: 'File size too large. Maximum size is 5MB.',
            code: 'FILE_TOO_LARGE'
        });
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (req.file && !allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.',
            code: 'INVALID_FILE_TYPE'
        });
    }

    next();
};

// SQL injection protection middleware
export const sqlInjectionProtection = (req, res, next) => {
    const sqlKeywords = [
        'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER',
        'UNION', 'EXEC', 'EXECUTE', 'SCRIPT', 'VBSCRIPT', 'JAVASCRIPT'
    ];

    const checkValue = (value) => {
        if (typeof value === 'string') {
            const upperValue = value.toUpperCase();
            for (const keyword of sqlKeywords) {
                if (upperValue.includes(keyword)) {
                    return false;
                }
            }
        }
        return true;
    };

    const checkObject = (obj) => {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    if (!checkObject(obj[key])) {
                        return false;
                    }
                } else {
                    if (!checkValue(obj[key])) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    if (!checkObject(req.body) || !checkObject(req.query) || !checkObject(req.params)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid input detected',
            code: 'INVALID_INPUT'
        });
    }

    next();
};

// Request logging middleware
export const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });

    next();
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            details: err.message,
            code: 'VALIDATION_ERROR'
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
            code: 'UNAUTHORIZED'
        });
    }

    if (err.name === 'ForbiddenError') {
        return res.status(403).json({
            success: false,
            message: 'Forbidden',
            code: 'FORBIDDEN'
        });
    }

    // Default error response
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
        code: 'INTERNAL_SERVER_ERROR'
    });
};

export default {
    createRateLimit,
    authRateLimit,
    apiRateLimit,
    uploadRateLimit,
    securityHeaders,
    corsOptions,
    validateInput,
    fileUploadSecurity,
    sqlInjectionProtection,
    requestLogger,
    errorHandler,
};