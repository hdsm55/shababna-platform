# Shababna Global - Youth Organization Platform

A comprehensive multilingual web platform for youth organization management, built with the PERN stack (PostgreSQL, Express.js, React, Node.js).

## Features

### 🌍 Multilingual Support
- Arabic (RTL), English, Turkish
- Dynamic language switching
- Proper RTL layout support

### 🎯 Core Functionality
- **Public Pages**: Home, Events, Programs, Join Us, Contact
- **Event Management**: Create, manage, and register for events
- **Program Management**: Long-term programs with support options
- **User Authentication**: JWT-based auth with role management
- **Admin Dashboard**: Complete CMS for content management
- **Donation Integration**: Ready for Stripe/Iyzico integration

### 🎨 Design Features
- Modern, responsive design
- Apple-level design aesthetics
- Smooth animations and micro-interactions
- Comprehensive color system
- Mobile-first approach

### 🔐 Security & Roles
- **Admin**: Full access to dashboard and management
- **Staff**: Limited admin access
- **Member**: Registered users
- **Visitor**: Public access

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **React Hook Form** for form handling
- **Zustand** for state management
- **i18next** for internationalization

### Backend
- **Node.js** with Express.js
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **helmet** for security headers
- **cors** for cross-origin requests

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd shababna-global-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start Development**
```bash
npm run dev
```

This will start both the client (port 5173) and server (port 5000) concurrently.

### Available Scripts

- `npm run dev` - Start both client and server in development
- `npm run dev:client` - Start only the client
- `npm run dev:server` - Start only the server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Generic UI components
│   ├── dashboard/      # Dashboard-specific components
│   └── layout/         # Layout components
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   └── dashboard/     # Dashboard pages
├── store/             # State management
├── i18n/              # Internationalization
│   └── locales/       # Translation files
└── types/             # TypeScript type definitions

server/
├── routes/            # API routes
├── middleware/        # Express middleware
└── utils/             # Utility functions
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (admin)
- `POST /api/events/:id/register` - Register for event

### Programs
- `GET /api/programs` - Get all programs
- `GET /api/programs/:id` - Get single program
- `POST /api/programs/:id/support` - Support program

### Users
- `POST /api/users/join` - Join organization
- `POST /api/users/contact` - Contact form

### Donations
- `POST /api/donations/create-intent` - Create donation
- `POST /api/donations/confirm/:id` - Confirm donation
- `GET /api/donations` - Get donations (admin)

## Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway/DigitalOcean)
```bash
# Set environment variables
# Deploy server/ folder
```

## Payment Integration

The platform is prepared for payment integration:

### Stripe (International)
1. Add Stripe keys to environment variables
2. Install Stripe SDK: `npm install stripe @stripe/stripe-js`
3. Implement payment flows in donation components

### Iyzico (Turkey)
1. Add Iyzico credentials to environment variables
2. Install Iyzico SDK: `npm install iyzipay`
3. Implement Turkish payment flows

## Database Integration

Currently using mock data. To integrate with PostgreSQL:

1. **Install dependencies**
```bash
npm install pg sequelize
```

2. **Set up database models**
3. **Replace mock data with database queries**
4. **Add migrations and seeders**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.