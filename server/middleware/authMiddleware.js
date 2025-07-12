import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

/**
 * Authentication middleware that verifies JWT tokens
 * Extracts token from Authorization header, verifies it, and attaches user to req.user
 */
const authenticateToken = async (req, res, next) => {
    try {
        // Get the authorization header
        const authHeader = req.headers.authorization;

        // Check if authorization header exists and has the correct format
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Access token required. Please provide Authorization header.'
            });
        }

        // Check if the header starts with 'Bearer '
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format. Use Bearer <token>'
            });
        }

        // Extract the token (remove 'Bearer ' prefix)
        const token = authHeader.substring(7);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is missing from Authorization header'
            });
        }

        // Verify the JWT token
        let decoded;
        try {
            decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
            );
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token has expired. Please login again.',
                    code: 'TOKEN_EXPIRED'
                });
            }

            if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token. Please provide a valid authentication token.',
                    code: 'INVALID_TOKEN'
                });
            }

            return res.status(401).json({
                success: false,
                message: 'Token verification failed',
                code: 'TOKEN_VERIFICATION_FAILED'
            });
        }

        // Verify that the decoded token has the required fields
        if (!decoded.id || !decoded.email) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token payload. Missing required user information.',
                code: 'INVALID_TOKEN_PAYLOAD'
            });
        }

        // Fetch the user from database to ensure they still exist and are active
        const userResult = await query('SELECT * FROM users WHERE id = $1', [decoded.id]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Token may be invalid.',
                code: 'USER_NOT_FOUND'
            });
        }

        // Check if user account is active
        if (!user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact support.',
                code: 'ACCOUNT_DEACTIVATED'
            });
        }

        // Verify that the user's email matches the token (in case email was changed)
        if (user.email !== decoded.email) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid. User information has changed.',
                code: 'USER_INFO_CHANGED'
            });
        }

        // Attach the user object to the request
        req.user = {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            is_admin: user.is_admin,
            is_active: user.is_active,
            created_at: user.created_at,
            updated_at: user.updated_at
        };

        // Add token info to request for debugging/logging purposes
        req.token = {
            id: decoded.id,
            email: decoded.email,
            is_admin: decoded.is_admin,
            is_active: decoded.is_active,
            iat: decoded.iat, // issued at
            exp: decoded.exp  // expiration
        };

        next();

    } catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during authentication',
            code: 'AUTH_ERROR'
        });
    }
};

/**
 * Optional authentication middleware
 * Similar to authenticateToken but doesn't return 401 if token is missing
 * Useful for routes that can work with or without authentication
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // No token provided, continue without authentication
            req.user = null;
            req.token = null;
            return next();
        }

        const token = authHeader.substring(7);

        if (!token) {
            req.user = null;
            req.token = null;
            return next();
        }

        // Try to verify the token
        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
            );

            // Fetch user from database
            const userResult = await query('SELECT * FROM users WHERE id = $1', [decoded.id]);
            const user = userResult.rows[0];

            if (user && user.is_active && user.email === decoded.email) {
                req.user = {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone: user.phone,
                    is_admin: user.is_admin,
                    is_active: user.is_active,
                    created_at: user.created_at,
                    updated_at: user.updated_at
                };
                req.token = decoded;
            } else {
                req.user = null;
                req.token = null;
            }
        } catch (jwtError) {
            // Token is invalid, but we don't return an error
            req.user = null;
            req.token = null;
        }

        next();

    } catch (error) {
        console.error('Optional authentication middleware error:', error);
        req.user = null;
        req.token = null;
        next();
    }
};

/**
 * Admin-only middleware
 * Must be used after authenticateToken middleware
 * Checks if the authenticated user is an admin
 */
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    if (!req.user.is_admin) {
        return res.status(403).json({
            success: false,
            message: 'Admin access required. Insufficient permissions.',
            code: 'INSUFFICIENT_PERMISSIONS'
        });
    }

    next();
};

/**
 * Active user middleware
 * Must be used after authenticateToken middleware
 * Ensures the user account is active
 */
const requireActiveUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    if (!req.user.is_active) {
        return res.status(403).json({
            success: false,
            message: 'Account is deactivated. Please contact support.',
            code: 'ACCOUNT_DEACTIVATED'
        });
    }

    next();
};

export {
    authenticateToken,
    authenticateToken as authMiddleware,
    optionalAuth,
    requireAdmin,
    requireActiveUser
};