import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { getRow, getRows, query } from '../config/database.js';
import { sendPasswordResetEmail, sendAdminNotification } from '../services/emailService.js';
import { createPasswordResetToken, validatePasswordResetToken, markTokenAsUsed } from '../services/tokenService.js';
import rateLimitService from '../services/rateLimitService.js';

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('first_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('last_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Helper function to handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
    return true;
  }
  return false;
};

// POST /register - Register a new user
router.post('/register', validateRegistration, async (req, res) => {
  try {
    // Check for validation errors
    if (handleValidationErrors(req, res)) return;

    const { email, password, first_name, last_name } = req.body;

    // Check if user already exists
    const existingUserResult = await getRow('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUserResult) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if this is the first user (make them admin)
    const userCountResult = await getRow('SELECT COUNT(*) as count FROM users');
    const userCount = parseInt(userCountResult.count);
    const role = userCount === 0 ? 'admin' : 'user';

    // Create new user
    const newUserResult = await query(`
      INSERT INTO users (email, password, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [email, hashedPassword, first_name, last_name, role]);

    const newUser = {
      id: newUserResult.rows[0].id,
      email,
      first_name,
      last_name,
      role
    };

    // Generate JWT token
    const token = generateToken(newUser);

    // إرسال إشعار للإدارة عند تسجيل عضو جديد (عدا المدير الأول)
    if (role !== 'admin') {
      try {
        const adminNotificationData = {
          form_type: 'new_user_registration',
          name: `${first_name} ${last_name}`,
          email: email,
          phone: 'غير محدد',
          subject: 'تسجيل عضو جديد',
          message: `تم تسجيل عضو جديد في المنصة:\n\nالاسم: ${first_name} ${last_name}\nالبريد الإلكتروني: ${email}\nتاريخ التسجيل: ${new Date().toLocaleString('ar-SA')}`
        };
        await sendAdminNotification(adminNotificationData);
        console.log('✅ تم إرسال إشعار تسجيل عضو جديد للإدارة');
      } catch (emailError) {
        console.error('❌ خطأ في إرسال إشعار تسجيل عضو جديد:', emailError);
        // لا نعيد خطأ للمستخدم لأن التسجيل تم بنجاح
      }
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: userCount === 0 ? 'Admin user registered successfully' : 'User registered successfully',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          role: newUser.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

// POST /login - Authenticate user and return JWT token
router.post('/login', validateLogin, async (req, res) => {
  try {
    // Check for validation errors
    if (handleValidationErrors(req, res)) return;

    const { email, password } = req.body;

    // Find user by email
    const userResult = await getRow('SELECT * FROM users WHERE email = $1', [email]);

    if (!userResult) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = userResult;

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return success response
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

// POST /forgot-password - Send password reset email
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
], async (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  try {
    // Check for validation errors
    if (handleValidationErrors(req, res)) return;

    const { email } = req.body;

    // Rate limiting check
    const rateLimitResult = await rateLimitService.checkRateLimit(clientIP, 'forgotPassword');

    if (!rateLimitResult.allowed) {
      console.log(`🚫 تم حظر طلب إعادة تعيين كلمة المرور من IP: ${clientIP}`);
      await rateLimitService.recordAttempt(clientIP, 'forgotPassword', clientIP, userAgent, false);

      return res.status(429).json({
        success: false,
        message: 'تم تجاوز الحد المسموح من المحاولات. يرجى المحاولة مرة أخرى لاحقاً.',
        retryAfter: rateLimitResult.resetTime
      });
    }

    // Check if user exists
    const userResult = await getRow('SELECT * FROM users WHERE email = $1', [email]);

    if (!userResult) {
      // For security reasons, don't reveal if email exists or not
      console.log(`🔍 طلب إعادة تعيين كلمة المرور لبريد غير مسجل: ${email}`);
      await rateLimitService.recordAttempt(clientIP, 'forgotPassword', clientIP, userAgent, true);

      return res.json({
        success: true,
        message: 'إن كان بريدك مسجّلًا لدينا، فستصلك رسالة لإعادة تعيين كلمة المرور.'
      });
    }

    const user = userResult;

    // Create password reset token
    const token = await createPasswordResetToken(user.id, clientIP, userAgent);

    if (!token) {
      console.error('❌ فشل في إنشاء توكن إعادة تعيين كلمة المرور');
      await rateLimitService.recordAttempt(clientIP, 'forgotPassword', clientIP, userAgent, false);

      return res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.'
      });
    }

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(
      user.email,
      token,
      user.first_name
    );

    if (emailSent) {
      console.log(`✅ تم إرسال بريد إعادة تعيين كلمة المرور للمستخدم: ${user.email}`);
      await rateLimitService.recordAttempt(clientIP, 'forgotPassword', clientIP, userAgent, true);

      res.json({
        success: true,
        message: 'إن كان بريدك مسجّلًا لدينا، فستصلك رسالة لإعادة تعيين كلمة المرور.'
      });
    } else {
      console.error('❌ فشل في إرسال بريد إعادة تعيين كلمة المرور');
      await rateLimitService.recordAttempt(clientIP, 'forgotPassword', clientIP, userAgent, false);

      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء إرسال البريد الإلكتروني. يرجى المحاولة مرة أخرى.'
      });
    }

  } catch (error) {
    console.error('❌ خطأ في طلب إعادة تعيين كلمة المرور:', error);
    await rateLimitService.recordAttempt(clientIP, 'forgotPassword', clientIP, userAgent, false);

    res.status(500).json({
      success: false,
      message: 'حدث خطأ داخلي أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.'
    });
  }
});

// GET /reset-password - Validate reset token
router.get('/reset-password', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'توكن إعادة تعيين كلمة المرور مطلوب'
      });
    }

    // Validate token
    const tokenData = await validatePasswordResetToken(token);

    if (!tokenData) {
      return res.status(400).json({
        success: false,
        message: 'توكن إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية'
      });
    }

    // Return token validation success
    res.json({
      success: true,
      message: 'توكن إعادة تعيين كلمة المرور صالح',
      data: {
        email: tokenData.email,
        firstName: tokenData.first_name,
        lastName: tokenData.last_name
      }
    });

  } catch (error) {
    console.error('❌ خطأ في التحقق من توكن إعادة تعيين كلمة المرور:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء التحقق من التوكن'
    });
  }
});

// POST /reset-password - Reset password with token
router.post('/reset-password', [
  body('token')
    .notEmpty()
    .withMessage('توكن إعادة تعيين كلمة المرور مطلوب'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
], async (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  try {
    // Check for validation errors
    if (handleValidationErrors(req, res)) return;

    const { token, password } = req.body;

    // Rate limiting check
    const rateLimitResult = await rateLimitService.checkRateLimit(clientIP, 'resetPassword');

    if (!rateLimitResult.allowed) {
      console.log(`🚫 تم حظر طلب إعادة تعيين كلمة المرور من IP: ${clientIP}`);
      await rateLimitService.recordAttempt(clientIP, 'resetPassword', clientIP, userAgent, false);

      return res.status(429).json({
        success: false,
        message: 'تم تجاوز الحد المسموح من المحاولات. يرجى المحاولة مرة أخرى لاحقاً.',
        retryAfter: rateLimitResult.resetTime
      });
    }

    // Validate token
    const tokenData = await validatePasswordResetToken(token);

    if (!tokenData) {
      console.log(`❌ محاولة استخدام توكن غير صالح: ${token}`);
      await rateLimitService.recordAttempt(clientIP, 'resetPassword', clientIP, userAgent, false);

      return res.status(400).json({
        success: false,
        message: 'توكن إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password
    await query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, tokenData.user_id]
    );

    // Mark token as used
    await markTokenAsUsed(token);

    console.log(`✅ تم تحديث كلمة المرور للمستخدم: ${tokenData.email}`);
    await rateLimitService.recordAttempt(clientIP, 'resetPassword', clientIP, userAgent, true);

    res.json({
      success: true,
      message: 'تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.'
    });

  } catch (error) {
    console.error('❌ خطأ في إعادة تعيين كلمة المرور:', error);
    await rateLimitService.recordAttempt(clientIP, 'resetPassword', clientIP, userAgent, false);

    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث كلمة المرور. يرجى المحاولة مرة أخرى.'
    });
  }
});

// GET /me - Get current user profile (protected route)
router.get('/me', async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
    );

    // Get user from database
    const user = await getRow('SELECT * FROM users WHERE id = $1', [decoded.id]);

    if (user.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = user.rows[0];

    // Return user profile
    res.json({
      success: true,
      data: {
        user: {
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
          created_at: userData.created_at
        }
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;