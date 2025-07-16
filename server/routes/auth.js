import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database.js';
import crypto from 'crypto';
import EmailService from '../services/emailService.js';
const emailService = new EmailService();

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
    const existingUserResult = await query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUserResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if this is the first user (make them admin)
    const userCountResult = await query('SELECT COUNT(*) as count FROM users');
    const userCount = parseInt(userCountResult.rows[0].count);
    const role = userCount === 0 ? 'admin' : 'user';

    // Create new user
    const newUserResult = await query(`
      INSERT INTO users (email, password, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, first_name, last_name, role
    `, [email, hashedPassword, first_name, last_name, role]);

    const newUser = newUserResult.rows[0];

    // Generate JWT token
    const token = generateToken(newUser);

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
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = userResult.rows[0];

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

// POST /forgot-password - إرسال رمز استعادة كلمة المرور
router.post('/forgot-password', [body('email').isEmail().normalizeEmail()], async (req, res) => {
  try {
    if (handleValidationErrors(req, res)) return;
    const { email } = req.body;
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      // لا تكشف أن الإيميل غير موجود لأسباب أمنية
      return res.json({ success: true, message: 'إذا كان البريد الإلكتروني مسجلاً ستصلك رسالة استعادة كلمة المرور.' });
    }
    const user = userResult.rows[0];
    // توليد رمز عشوائي
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 دقيقة
    // حذف أي رموز سابقة
    await query('DELETE FROM password_resets WHERE user_id = $1', [user.id]);
    // حفظ الرمز في قاعدة البيانات
    await query('INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)', [user.id, token, expiresAt]);
    // إرسال الإيميل
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    const subject = 'إعادة تعيين كلمة المرور - منصة شبابنا';
    const content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #14b8a6;">طلب إعادة تعيين كلمة المرور</h2>
        <p>مرحباً ${user.first_name || ''}،</p>
        <p>لقد تم تقديم طلب لإعادة تعيين كلمة المرور الخاصة بحسابك في منصة شبابنا.</p>
        <p>إذا لم تقم بهذا الطلب، يمكنك تجاهل هذه الرسالة.</p>
        <p>لإعادة تعيين كلمة المرور، اضغط على الرابط التالي أو انسخه في متصفحك:</p>
        <a href="${resetLink}" style="color: #14b8a6;">إعادة تعيين كلمة المرور</a>
        <p>هذا الرابط صالح لمدة 15 دقيقة فقط.</p>
        <p>مع تحيات فريق شبابنا</p>
      </div>
    `;
    await emailService.sendEmail(email, user.first_name, subject, content, 'password_reset');
    return res.json({ success: true, message: 'إذا كان البريد الإلكتروني مسجلاً ستصلك رسالة استعادة كلمة المرور.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء معالجة الطلب.' });
  }
});

// POST /reset-password - إعادة تعيين كلمة المرور
router.post('/reset-password', [
  body('email').isEmail().normalizeEmail(),
  body('token').isLength({ min: 32 }),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    if (handleValidationErrors(req, res)) return;
    const { email, token, password } = req.body;
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'بيانات غير صحيحة.' });
    }
    const user = userResult.rows[0];
    // تحقق من الرمز
    const resetResult = await query('SELECT * FROM password_resets WHERE user_id = $1 AND token = $2', [user.id, token]);
    if (resetResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'رمز الاستعادة غير صالح أو منتهي.' });
    }
    const reset = resetResult.rows[0];
    if (new Date(reset.expires_at) < new Date()) {
      await query('DELETE FROM password_resets WHERE user_id = $1', [user.id]);
      return res.status(400).json({ success: false, message: 'انتهت صلاحية رمز الاستعادة. يرجى طلب رمز جديد.' });
    }
    // تحديث كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);
    await query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);
    // حذف الرمز
    await query('DELETE FROM password_resets WHERE user_id = $1', [user.id]);
    // إشعار المستخدم
    const subject = 'تم تغيير كلمة المرور بنجاح - منصة شبابنا';
    const content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #14b8a6;">تم تغيير كلمة المرور</h2>
        <p>مرحباً ${user.first_name || ''}،</p>
        <p>تم تغيير كلمة المرور الخاصة بحسابك بنجاح.</p>
        <p>إذا لم تقم بهذا التغيير، يرجى التواصل مع الدعم فوراً.</p>
        <p>مع تحيات فريق شبابنا</p>
      </div>
    `;
    await emailService.sendEmail(email, user.first_name, subject, content, 'password_reset_success');
    return res.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء إعادة تعيين كلمة المرور.' });
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
    const user = await query('SELECT * FROM users WHERE id = $1', [decoded.id]);

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