import dotenv from 'dotenv';
dotenv.config();

export const emailConfig = {
    // Gmail Configuration
    gmail: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    },

    // SendGrid Configuration
    sendgrid: {
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY,
        },
    },

    // Mailgun Configuration
    mailgun: {
        host: 'smtp.mailgun.org',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAILGUN_USERNAME,
            pass: process.env.MAILGUN_PASSWORD,
        },
    },

    // Outlook Configuration
    outlook: {
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.OUTLOOK_USER,
            pass: process.env.OUTLOOK_PASS,
        },
    },

    // Default configuration based on environment
    default: process.env.NODE_ENV === 'production' ? 'sendgrid' : 'gmail',
};

export const emailSettings = {
    fromEmail: process.env.FROM_EMAIL || 'noreply@shababna-global.com',
    fromName: process.env.FROM_NAME || 'Shababna Global',
    adminEmails: (process.env.ADMIN_EMAILS && process.env.ADMIN_EMAILS.split(',').filter(Boolean)) || ['admin@shababna-global.com'],
    replyTo: process.env.REPLY_TO_EMAIL || 'contact@shababna-global.com',
};

// Validation function
export const validateEmailConfig = () => {
    const requiredVars = ['SMTP_USER', 'SMTP_PASS', 'FROM_EMAIL'];
    const missing = requiredVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
        console.warn('⚠️  Missing email configuration variables:', missing);
        console.warn('📧 Email functionality will be disabled');
        return false;
    }

    return true;
};