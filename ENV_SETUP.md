# Environment Setup Instructions

Copy these template files to `.env` in each directory and fill in your values.

## admin/.env
```
VITE_BACKEND_URL=http://localhost:8000
```

## frontendv3/.env  
```
VITE_BACKEND_URL=http://localhost:8000
```

## backendv3/.env
```
PORT=8000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/fantasyluxe
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=http://localhost:5000,http://localhost:5173
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
```

## Quick Start

1. Create the `.env` files as shown above
2. Fill in your MongoDB and Cloudinary credentials
3. Run `start-all.bat` to launch all services

## Service URLs
- **Backend API**: http://localhost:8000
- **Frontend Store**: http://localhost:5000  
- **Admin Panel**: http://localhost:5173
