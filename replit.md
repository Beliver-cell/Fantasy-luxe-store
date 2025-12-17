# Fantasy Luxe - E-commerce Application

## Overview
Fantasy Luxe is a full-stack e-commerce application for fashion/apparel with a React frontend and Express.js backend.

## Project Structure
```
fantasy_luxe/
├── frontendv3/     # React + Vite frontend (port 5000)
├── backendv3/      # Express.js API backend (port 8000)
└── admin/          # Admin panel (not deployed)
```

## Tech Stack
- **Frontend**: React 19, Vite, TailwindCSS
- **Backend**: Express.js, MongoDB (Mongoose)
- **Authentication**: JWT
- **Image Storage**: Cloudinary
- **Payment**: Stripe

## Running Locally
The application has two workflows:
1. **Frontend**: Runs Vite dev server on port 5000
2. **Backend API**: Runs Express server on port 8000

## Environment Variables Required
The following secrets need to be configured for full functionality:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token generation
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `STRIPE_SECRET_KEY` - Stripe secret key (for payments)
- `ADMIN_EMAIL` - Admin email
- `ADMIN_PASSWORD` - Admin password

## API Endpoints
- `/api/user` - User authentication and management
- `/api/product` - Product CRUD operations
- `/api/cart` - Shopping cart operations
- `/api/order` - Order management

## Recent Changes
- 2024-12-17: Initial Replit setup
  - Changed backend port from 4000 to 8000
  - Fixed package.json syntax error
  - Configured workflows for development
  - Set up deployment configuration
