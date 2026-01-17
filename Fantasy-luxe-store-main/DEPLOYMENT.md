# Fantasy Luxe - Vercel Deployment Guide

This guide will help you deploy all three parts of Fantasy Luxe to Vercel.

## Project Structure

You have 3 apps that need to be deployed separately:

1. **Backend API** (`backendv3/`) - Express.js serverless API
2. **Frontend Store** (`frontendv3/`) - Customer-facing React store
3. **Admin Panel** (`admin/`) - Admin dashboard

## Deployment Order

Deploy in this order:
1. Backend API first (you'll need its URL for the other apps)
2. Frontend Store
3. Admin Panel

---

## Step 1: Deploy Backend API

### On Vercel:
1. Go to [vercel.com](https://vercel.com) and click "Add New Project"
2. Import your GitHub repository
3. Set **Root Directory** to: `backendv3`
4. Framework Preset: Select "Other"
5. Build settings should auto-detect from vercel.json

### Required Environment Variables for Backend:
```
NODE_ENV=production
MONGODB_URI=<your MongoDB connection string>
JWT_SECRET=<a strong random secret key>
CLOUDINARY_NAME=<your Cloudinary cloud name>
CLOUDINARY_API_KEY=<your Cloudinary API key>
CLOUDINARY_API_SECRET=<your Cloudinary API secret>
FRONTEND_URL=<your frontend Vercel URL, e.g., https://fantasy-luxe.vercel.app>
CORS_ORIGIN=<comma-separated allowed origins>
FLUTTERWAVE_SECRET_KEY=<your Flutterwave secret key>
```

### Optional Environment Variables:
```
RESEND_API_KEY=<for email notifications>
EMAIL_USER=<email username>
EMAIL_PASS=<email password>
CURRENCY=NGN
DELIVERY_CHARGE=500
```

After deployment, note the backend URL (e.g., `https://fantasy-luxe-backend.vercel.app`)

---

## Step 2: Deploy Frontend Store

### On Vercel:
1. Add another new project from the same repository
2. Set **Root Directory** to: `frontendv3`
3. Framework Preset: Select "Vite"
4. Build Command: `npm run build`
5. Output Directory: `dist`

### Required Environment Variables for Frontend:
```
VITE_BACKEND_URL=<your backend URL from Step 1>
```

Example: `VITE_BACKEND_URL=https://fantasy-luxe-backend.vercel.app`

---

## Step 3: Deploy Admin Panel

### On Vercel:
1. Add another new project from the same repository
2. Set **Root Directory** to: `admin`
3. Framework Preset: Select "Vite"
4. Build Command: `npm run build`
5. Output Directory: `dist`

### Required Environment Variables for Admin:
```
VITE_BACKEND_URL=<your backend URL from Step 1>
```

---

## Post-Deployment Checklist

After all three apps are deployed:

1. **Update Backend CORS**: Go to your backend project settings on Vercel and update:
   - `FRONTEND_URL` to your deployed frontend URL
   - `CORS_ORIGIN` to include both frontend and admin URLs (comma-separated)

2. **Test the Applications**:
   - Visit your frontend URL and verify products load
   - Visit your admin URL and test login
   - Try adding a product from admin and verify it appears on the store

3. **Set up Custom Domains** (optional):
   - Go to each project's Settings > Domains
   - Add your custom domains

---

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:
- Verify `FRONTEND_URL` and `CORS_ORIGIN` in your backend environment variables
- Make sure URLs include the full protocol (https://)
- Redeploy the backend after updating environment variables

### Database Connection Errors
- Verify your `MONGODB_URI` is correct
- Make sure your MongoDB Atlas IP whitelist includes `0.0.0.0/0` (allow from anywhere) for serverless

### API Not Working
- Check that `VITE_BACKEND_URL` in frontend/admin points to the correct backend URL
- Don't include a trailing slash in the URL

### Build Failures
- All builds have been tested and work locally
- If Vercel build fails, check the build logs for specific errors

---

## Environment Variables Summary

| Variable | Backend | Frontend | Admin |
|----------|---------|----------|-------|
| NODE_ENV | Yes | - | - |
| MONGODB_URI | Yes | - | - |
| JWT_SECRET | Yes | - | - |
| CLOUDINARY_NAME | Yes | - | - |
| CLOUDINARY_API_KEY | Yes | - | - |
| CLOUDINARY_API_SECRET | Yes | - | - |
| FRONTEND_URL | Yes | - | - |
| CORS_ORIGIN | Yes | - | - |
| FLUTTERWAVE_SECRET_KEY | Yes | - | - |
| VITE_BACKEND_URL | - | Yes | Yes |
