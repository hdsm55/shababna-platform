/**
 * Admin middleware that requires authentication and admin privileges
 * Must be used after authenticateToken middleware
 * Checks if the authenticated user has admin privileges
 */

const requireAdmin = (req, res, next) => {
    // First, ensure user is authenticated
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required. Please login to access this resource.',
            code: 'AUTHENTICATION_REQUIRED'
        });
    }

    // Check if user account is active
    if (!req.user.is_active) {
        return res.status(403).json({
            success: false,
            message: 'Account is deactivated. Please contact support to reactivate your account.',
            code: 'ACCOUNT_DEACTIVATED'
        });
    }

    // Check if user has admin privileges
    if (!req.user.is_admin) {
        return res.status(403).json({
            success: false,
            message: 'Admin access required. You do not have permission to access this resource.',
            code: 'INSUFFICIENT_PERMISSIONS',
            details: {
                required_role: 'admin',
                current_role: 'user',
                user_id: req.user.id,
                email: req.user.email
            }
        });
    }

    // User is authenticated, active, and has admin privileges
    // Add admin-specific information to request for logging/debugging
    req.isAdmin = true;
    req.adminUser = {
        id: req.user.id,
        email: req.user.email,
        name: `${req.user.first_name} ${req.user.last_name}`,
        access_level: 'admin'
    };

    next();
};

/**
 * Super admin middleware (for future use)
 * Can be used for routes that require super admin privileges
 * Currently same as requireAdmin, but can be extended later
 */
const requireSuperAdmin = (req, res, next) => {
    // First, ensure user is authenticated
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required. Please login to access this resource.',
            code: 'AUTHENTICATION_REQUIRED'
        });
    }

    // Check if user account is active
    if (!req.user.is_active) {
        return res.status(403).json({
            success: false,
            message: 'Account is deactivated. Please contact support to reactivate your account.',
            code: 'ACCOUNT_DEACTIVATED'
        });
    }

    // Check if user has admin privileges
    if (!req.user.is_admin) {
        return res.status(403).json({
            success: false,
            message: 'Super admin access required. You do not have permission to access this resource.',
            code: 'INSUFFICIENT_PERMISSIONS',
            details: {
                required_role: 'super_admin',
                current_role: 'user',
                user_id: req.user.id,
                email: req.user.email
            }
        });
    }

    // For now, super admin is the same as admin
    // In the future, you can add additional checks here
    // For example: check for a super_admin field in the users table

    // User is authenticated, active, and has super admin privileges
    req.isSuperAdmin = true;
    req.superAdminUser = {
        id: req.user.id,
        email: req.user.email,
        name: `${req.user.first_name} ${req.user.last_name}`,
        access_level: 'super_admin'
    };

    next();
};

/**
 * Admin or self middleware
 * Allows access if user is admin OR if they're accessing their own data
 * Useful for profile management routes
 */
const requireAdminOrSelf = (userIdParam = 'id') => {
    return (req, res, next) => {
        // First, ensure user is authenticated
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please login to access this resource.',
                code: 'AUTHENTICATION_REQUIRED'
            });
        }

        // Check if user account is active
        if (!req.user.is_active) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated. Please contact support to reactivate your account.',
                code: 'ACCOUNT_DEACTIVATED'
            });
        }

        // Get the user ID from the request (from params, body, or query)
        const targetUserId = req.params[userIdParam] || req.body[userIdParam] || req.query[userIdParam];

        if (!targetUserId) {
            return res.status(400).json({
                success: false,
                message: `User ID parameter '${userIdParam}' is required.`,
                code: 'MISSING_USER_ID'
            });
        }

        // Allow access if user is admin OR if they're accessing their own data
        const isAdmin = req.user.is_admin;
        const isSelf = parseInt(req.user.id) === parseInt(targetUserId);

        if (!isAdmin && !isSelf) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only access your own data or admin access is required.',
                code: 'ACCESS_DENIED',
                details: {
                    user_id: req.user.id,
                    target_user_id: targetUserId,
                    is_admin: isAdmin,
                    is_self: isSelf
                }
            });
        }

        // Add access information to request
        req.accessInfo = {
            user_id: req.user.id,
            target_user_id: targetUserId,
            is_admin: isAdmin,
            is_self: isSelf,
            access_type: isAdmin ? 'admin' : 'self'
        };

        next();
    };
};

/**
 * Admin or owner middleware
 * Allows access if user is admin OR if they own the resource
 * Useful for resource management routes
 */
const requireAdminOrOwner = (ownerField = 'user_id') => {
    return async (req, res, next) => {
        try {
            // First, ensure user is authenticated
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required. Please login to access this resource.',
                    code: 'AUTHENTICATION_REQUIRED'
                });
            }

            // Check if user account is active
            if (!req.user.is_active) {
                return res.status(403).json({
                    success: false,
                    message: 'Account is deactivated. Please contact support to reactivate your account.',
                    code: 'ACCOUNT_DEACTIVATED'
                });
            }

            // If user is admin, allow access
            if (req.user.is_admin) {
                req.accessInfo = {
                    user_id: req.user.id,
                    is_admin: true,
                    access_type: 'admin'
                };
                return next();
            }

            // For non-admin users, check if they own the resource
            // This would typically involve querying the database to check ownership
            // For now, we'll assume the resource ID is in the request
            const resourceId = req.params.id || req.body.id || req.query.id;

            if (!resourceId) {
                return res.status(400).json({
                    success: false,
                    message: 'Resource ID is required.',
                    code: 'MISSING_RESOURCE_ID'
                });
            }

            // Note: In a real implementation, you would query the database here
            // to check if the user owns the resource
            // For example:
            // const resource = await db('resources').where('id', resourceId).first();
            // if (!resource || resource[ownerField] !== req.user.id) {
            //   return res.status(403).json({ ... });
            // }

            // For now, we'll return an error indicating this needs implementation
            return res.status(501).json({
                success: false,
                message: 'Admin or owner check not implemented for this resource.',
                code: 'NOT_IMPLEMENTED'
            });

        } catch (error) {
            console.error('Admin or owner middleware error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error during authorization check.',
                code: 'AUTHORIZATION_ERROR'
            });
        }
    };
};

export {
    requireAdmin as adminMiddleware,
    requireSuperAdmin,
    requireAdminOrSelf,
    requireAdminOrOwner
};