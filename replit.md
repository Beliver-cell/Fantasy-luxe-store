# Fantasy Luxe Store

## Overview
Fantasy Luxe is a premium fashion e-commerce platform with a React frontend, Node.js/Express backend, and MongoDB database.

## Project Structure
```
Fantasy-luxe-store-main/
├── frontendv3/    # React + Vite frontend (port 5000)
├── backendv3/     # Express.js API backend (port 8000)
└── admin/         # Admin dashboard
```

## Running the App
The app runs via `start.sh` which launches:
- Backend API on port 8000
- Frontend dev server on port 5000

## Required Environment Variables
The following secrets need to be configured:
- `MONGODB_URI` - MongoDB connection string (required)
- `JWT_SECRET` - Secret for JWT tokens (configured)
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - For image uploads
- `STRIPE_SECRET_KEY` or `FLUTTERWAVE_SECRET_KEY` - For payments

## Tech Stack
- Frontend: React 19, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- Image Storage: Cloudinary
- Payments: Stripe/Flutterwave

## Recent Changes
- Configured for Replit environment
- Added CORS support for Replit domains
- Set up workflow to run both frontend and backend
