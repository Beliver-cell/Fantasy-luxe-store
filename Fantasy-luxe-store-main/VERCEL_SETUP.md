# Vercel Deployment - Environment Variables Setup

## Security Best Practice
All sensitive variables (API keys, secrets, database URIs) should be set in Vercel, NOT committed to code.

## For Backend Deployment

1. **Connect your repository to Vercel**
2. **Go to: Project Settings > Environment Variables**
3. **Add these variables:**

```
PORT=8000
NODE_ENV=production

# MongoDB
MONGODB_URI=your_production_mongodb_uri

# JWT
JWT_SECRET=your_very_secure_random_key_here

# Admin
ADMIN_EMAIL=admin@fantasyluxe.com
ADMIN_PASSWORD=your_secure_password

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Paystack (Only Payment Method)
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key

# Email (Choose one: Gmail or SendGrid)
# Option 1: Gmail
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Option 2: SendGrid (recommended for production)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# CORS
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Frontend URL
FRONTEND_URL=https://yourdomain.com
```

## For Frontend Deployment

1. **Go to: Project Settings > Environment Variables**
2. **Add:**

```
VITE_BACKEND_URL=https://your-backend-api.vercel.app
```

## For Admin Panel Deployment

1. **Deploy admin separately or on same Vercel project**
2. **Secret URL remains:** `/admin-fantasy-luxe-panel-working`
3. **Backend URL:**

```
VITE_BACKEND_URL=https://your-backend-api.vercel.app
```

## Important Notes

- **DO NOT commit `.env` files to GitHub**
- **All sensitive data goes in Vercel only**
- The `.gitignore` file prevents `.env` from being committed
- Environment variables are injected at runtime by Vercel
- Each deployment environment can have different variables (Development, Preview, Production)

## Verify Setup

After deployment, Vercel will:
1. Pull your code from GitHub
2. Skip `.env` files (they're in `.gitignore`)
3. Inject environment variables you set in Vercel
4. Build and deploy your app

✅ Your code stays clean, secrets stay in Vercel!
