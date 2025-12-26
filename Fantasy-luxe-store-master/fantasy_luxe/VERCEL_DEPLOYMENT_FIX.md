# Vercel Deployment Fix - Separate Projects

## Problem Fixed
The `.vercelignore` files were too aggressive and caused build failures. They're now minimal.

## Deploy Each Separately (3 Projects)

### Backend Deployment
1. Go to https://vercel.com
2. Click "Add New" → "Project"  
3. Select your repo
4. **Root Directory**: `backendv3`
5. **Environment Variables** → Add ALL:
```
MONGODB_URI=your_uri
JWT_SECRET=your_secret
FLUTTERWAVE_SECRET_KEY=your_key
FLUTTERWAVE_PUBLIC_KEY=your_key
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
CORS_ORIGIN=https://your-frontend-domain.vercel.app
NODE_ENV=production
```
6. Click "Deploy"
7. Wait 5-10 minutes
8. Note your Backend URL: `https://xxxxx.vercel.app`

### Frontend Deployment
1. "Add New" → "Project"
2. Select your repo
3. **Root Directory**: `frontendv3`
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables**:
```
VITE_BACKEND_URL=https://your-backend-url-from-above.vercel.app
```
7. Deploy

### Admin Deployment  
1. "Add New" → "Project"
2. Select your repo
3. **Root Directory**: `admin`
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables**:
```
VITE_BACKEND_URL=https://your-backend-url.vercel.app
```
7. Deploy

## CORS Setup
Update your backend's `CORS_ORIGIN` with your frontend URL after frontend deploys.

## Testing
- Frontend: `https://frontend-url.vercel.app`
- Admin: `https://admin-url.vercel.app/admin-fantasy-luxe-panel-working`
- API: `https://backend-url.vercel.app/api/product/list`

**All should work now! ✅**
