# Monorepo Deployment on Vercel (Single Repository)

## What's Configured

Your **single Vercel project** now has:
- ✅ **Backend API** at `/api/*` routes
- ✅ **Frontend** at root `/`
- ✅ **Admin Panel** at `/admin-fantasy-luxe-panel-working`

All in ONE Vercel deployment!

---

## Step 1: Update Backend Production Settings

In `backendv3/server.js`, verify port is set correctly:
```javascript
const port = process.env.PORT || 8000
```

✅ **Already correct** - Vercel will set PORT automatically

---

## Step 2: Environment Variables in Vercel

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add BOTH for root and backend:

```
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_key_32+chars
FLUTTERWAVE_SECRET_KEY=your_flutterwave_key
FLUTTERWAVE_PUBLIC_KEY=your_public_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_secret
EMAIL_SERVICE=gmail (or sendgrid)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
SENDGRID_API_KEY=optional
SENDGRID_FROM_EMAIL=optional
CORS_ORIGIN=https://yourdomain.com
ADMIN_EMAIL=admin@fantasyluxe.com
ADMIN_PASSWORD=your_secure_password
NODE_ENV=production
```

---

## Step 3: Build Commands in Vercel

Make sure Vercel has these build commands:

**Frontend Build:**
```
cd frontendv3 && npm run build
```

**Admin Build:**
```
cd admin && npm run build
```

**Backend:** No build needed (Node.js direct)

---

## Step 4: URLs After Deployment

Once deployed to Vercel:

| Part | URL |
|---|---|
| Frontend | `https://your-vercel-project.vercel.app/` |
| Admin Panel | `https://your-vercel-project.vercel.app/admin-fantasy-luxe-panel-working` |
| API | `https://your-vercel-project.vercel.app/api/` |

---

## Step 5: Test Everything

### Test Frontend
```
https://your-vercel-project.vercel.app/
```
Should load your store

### Test Admin Panel
```
https://your-vercel-project.vercel.app/admin-fantasy-luxe-panel-working
```
Should load admin login

### Test API
```
https://your-vercel-project.vercel.app/api/product/list
```
Should return products list

### Test Payment
Try checkout → should redirect to Flutterwave

---

## Common Issues & Fixes

### Issue: "Cannot find module" errors
**Fix:** Make sure `node_modules` is in all 3 folders
```bash
cd backendv3 && npm install
cd ../frontendv3 && npm install
cd ../admin && npm install
```

### Issue: Frontend shows API 404 errors
**Fix:** Check `VITE_BACKEND_URL` in frontend .env:
```
VITE_BACKEND_URL=https://your-vercel-project.vercel.app
```

### Issue: Admin panel 404
**Fix:** Check admin `vite.config.js` has:
```javascript
base: '/admin-fantasy-luxe-panel-working/'
```

### Issue: CORS errors
**Fix:** Update CORS_ORIGIN in Vercel env:
```
CORS_ORIGIN=https://your-vercel-project.vercel.app
```

---

## Redeploy After Changes

1. Push code to GitHub
2. Vercel auto-deploys
3. Or manually redeploy from Vercel dashboard

---

## Files Created for Monorepo Support

- ✅ `vercel.json` - Routes and build configuration
- ✅ `backendv3/.vercelignore` - Ignore other folders during build
- ✅ `frontendv3/.vercelignore` - Ignore other folders during build
- ✅ `admin/.vercelignore` - Ignore other folders during build

**All set! Your monorepo should now work on Vercel! 🚀**
