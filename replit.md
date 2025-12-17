# Fantasy Luxe - E-commerce Application

## Overview
Fantasy Luxe is a full-stack e-commerce application for fashion/apparel with a React frontend, Express.js backend, and admin panel.

## Project Structure
```
fantasy_luxe/
├── frontendv3/     # React + Vite frontend (port 5000) - Customer-facing store
├── backendv3/      # Express.js API backend (port 8000)
├── admin/          # Admin panel (port 5173) - Product & category management
```

## Tech Stack
- **Frontend**: React 19, Vite, TailwindCSS
- **Backend**: Express.js, MongoDB (Mongoose)
- **Admin**: React 18, Vite, TailwindCSS
- **Authentication**: JWT
- **Image Storage**: Cloudinary
- **Payment**: Stripe

## Running Locally
The application has three workflows:
1. **Frontend**: Runs Vite dev server on port 5000 (main webview)
2. **Backend API**: Runs Express server on port 8000
3. **Admin Panel**: Runs on port 5173 (access via URL)

## Environment Variables Required
The following secrets need to be configured for full functionality:

### Required for Database:
- `MONGODB_URI` - MongoDB connection string

### Required for Authentication:
- `JWT_SECRET` - Secret for JWT token generation

### Required for Image Upload:
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Optional:
- `STRIPE_SECRET_KEY` - Stripe secret key (for payments)
- `ADMIN_EMAIL` - Admin email
- `ADMIN_PASSWORD` - Admin password

## API Endpoints
- `/api/user` - User authentication and management
- `/api/product` - Product CRUD operations
- `/api/cart` - Shopping cart operations
- `/api/order` - Order management
- `/api/category` - Category management (new)

## Admin Panel Features
- Add/Edit/Delete products with image uploads
- Category management (Create, Read, Update, Delete)
- Order management
- Product listing and filtering

## Recent Changes
- 2024-12-17: Initial Replit setup
  - Changed backend port from 4000 to 8000
  - Fixed package.json syntax error in backend
  - Fixed Cloudinary configuration (wrong env var names)
  - Added type="submit" to Add Product button
  - Created Category model with CRUD endpoints
  - Updated admin panel with dynamic category management
  - Added Categories page with full CRUD (Create, Read, Update, Delete)
  - Configured all three workflows
  - Set up deployment configuration
