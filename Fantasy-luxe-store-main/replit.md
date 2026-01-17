# Fantasy Luxe - E-commerce Application

## Overview
Fantasy Luxe is a full-stack e-commerce application for fashion/apparel with a React frontend and Express.js backend.

## Project Structure
```
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
- **Payment**: Flutterwave

## Workflows
1. **Frontend**: Runs Vite dev server on port 5000 (main webview)
2. **Backend API**: Runs Express server on port 8000

## Environment Variables Required
The following secrets need to be configured for full functionality:

### Required for Database:
- `MONGODB_URI` - MongoDB connection string (e.g., from MongoDB Atlas)

### Required for Authentication:
- `JWT_SECRET` - Secret for JWT token generation

### Required for Image Upload:
- `CLOUDINARY_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Required for Payments:
- `FLUTTERWAVE_SECRET_KEY` - Flutterwave secret key

### Optional:
- `RESEND_API_KEY` - Resend API key for emails
- `EMAIL_USER` - Email user
- `EMAIL_PASS` - Email password

## API Endpoints
- `/api/user` - User authentication and management
- `/api/product` - Product CRUD operations
- `/api/cart` - Shopping cart operations
- `/api/order` - Order management
- `/api/category` - Category management
- `/api/settings` - Settings management
- `/api/subscriber` - Newsletter subscription management

## Recent Changes
- 2026-01-16: Admin dashboard analytics
  - Added Dashboard page with total subscribers and total signups counts
  - View all subscriber emails with subscription dates
  - Recent activity feed showing latest subscribers and user signups
  - New API endpoints: /api/subscriber/list and /api/subscriber/analytics (admin-protected)

- 2026-01-16: Production readiness improvements
  - Fixed ProductItems.jsx to handle image arrays with proper fallback and error handling
  - Fixed Flutterwave payment verification: added Number() coercion and NaN checks for amount comparison
  - Added mobile-first UI: profile/orders/logout in mobile menu
  - Admin product management: colors field, flexible sizes, multiple image upload
  - Search from homepage now navigates to collections
  - Checkout auto-fills user address from saved profile
  - User-friendly error handling throughout (Login, Placeorder, Verify pages)
  - Added admin toggle for free delivery: can enable/disable free delivery promotion
  - Delivery fee now always shown by default (no automatic "FREE" unless admin enables it)

- 2026-01-15: Profile management and security improvements
  - Added full profile editing (name, phone, address) stored in database
  - Created secure GET /api/user/profile and PUT /api/user/profile endpoints
  - Added phone and address fields to user model
  - Fixed auth middleware to use req.userId for GET requests
  - Input validation and sanitization on profile updates
  - Fixed cart empty state to show immediately (no loading dependency)

- 2026-01-15: UX improvements and new features
  - Added password visibility toggle to all password fields (frontend + admin)
  - Created EmptyState component for empty cart/orders with product recommendations
  - Added professional Profile page with account info, order count, and navigation
  - Updated Cart page to show suggestions when empty
  - Updated Orders page to show recommendations when no orders exist
  - Added FAQ and LocalBusiness schema for better SEO
  - Updated email sender to use verified domain (noreply@fantasyluxe.store)

- 2026-01-15: Added newsletter subscription system
  - Created subscriber model, controller, and routes
  - Added subscription confirmation emails via Resend
  - Updated NewsLetter component to call subscription API
  - Subscribers get 20% off welcome code (WELCOME20)

- 2026-01-14: Fixed deployment issues
  - Updated admin Tailwind CSS to v4 (compatible with @tailwindcss/vite plugin)
  - Removed obsolete postcss.config.js and tailwind.config.js from admin
  - Fixed missing backendUrl export in admin/src/App.jsx
  - Admin build now succeeds for Vercel deployment
  - MongoDB connected with MONGODB_URI secret
  - Both workflows running successfully
