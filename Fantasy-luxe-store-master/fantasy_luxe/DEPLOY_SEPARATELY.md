# Deploy Each App Separately on Vercel

## Strategy: 3 Separate Vercel Projects (Best for Production)

This is the **recommended way** - each app on its own Vercel project:
- Backend API
- Frontend Store
- Admin Panel

---

## DEPLOYMENT STEPS

### **Project 1: Backend API**

**Step 1: Create New Vercel Project**
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your "Fantasy-luxe-store" repository
4. Click "Deploy"

**Step 2: Configure Backend**
1. In Vercel, go to **Settings → Root Directory**
2. Set to: `backendv3`
3. Click Save

**Step 3: Add Environment Variables**
1. Go to **Settings → Environment Variables**
2. Add these:
```
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_key_32+characters
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret
FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
SENDGRID_API_KEY=optional
SENDGRID_FROM_EMAIL=optional
CORS_ORIGIN=https://your-frontend-vercel-domain.vercel.app
ADMIN_EMAIL=admin@fantasyluxe.com
ADMIN_PASSWORD=secure_password
NODE_ENV=production
```

**Step 4: Deploy**
- Vercel will auto-deploy
- Note your Backend URL: `https://xxx.vercel.app`

---

### **Project 2: Frontend Store**

**Step 1: Create New Vercel Project**
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your "Fantasy-luxe-store" repository AGAIN
4. Click "Deploy"

**Step 2: Configure Frontend**
1. Go to **Settings → Root Directory**
2. Set to: `frontendv3`
3. Go to **Build & Development Settings**
4. Build Command: `npm run build`
5. Output Directory: `dist`

**Step 3: Add Environment Variable**
1. Go to **Settings → Environment Variables**
2. Add:
```
VITE_BACKEND_URL=https://your-backend-vercel-url.vercel.app
```
(Use the Backend URL from Step 1)

**Step 4: Deploy**
- Your Frontend URL: `https://yyy.vercel.app`

---

### **Project 3: Admin Panel**

**Step 1: Create New Vercel Project**
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your "Fantasy-luxe-store" repository AGAIN
4. Click "Deploy"

**Step 2: Configure Admin**
1. Go to **Settings → Root Directory**
2. Set to: `admin`
3. Go to **Build & Development Settings**
4. Build Command: `npm run build`
5. Output Directory: `dist`

**Step 3: Add Environment Variable**
1. Go to **Settings → Environment Variables**
2. Add:
```
VITE_BACKEND_URL=https://your-backend-vercel-url.vercel.app
```

**Step 4: Deploy**
- Your Admin URL: `https://zzz.vercel.app/admin-fantasy-luxe-panel-working`

---

## FINAL URLS AFTER DEPLOYMENT

| Part | URL |
|---|---|
| **Frontend Store** | `https://frontend-xxx.vercel.app` |
| **Admin Panel** | `https://admin-yyy.vercel.app/admin-fantasy-luxe-panel-working` |
| **Backend API** | `https://backend-zzz.vercel.app` |

---

## TESTING AFTER DEPLOYMENT

### Test Frontend
```
https://frontend-xxx.vercel.app
```
Should load your store ✅

### Test Admin
```
https://admin-yyy.vercel.app/admin-fantasy-luxe-panel-working
```
Should load admin login ✅

### Test API
```
https://backend-zzz.vercel.app/api/product/list
```
Should return products ✅

### Test Payment
- Go to frontend
- Add product to cart
- Click checkout
- Should redirect to Flutterwave ✅

---

## IMPORTANT: Update Frontend URLs

After getting your Backend URL, update the **Frontend's Environment Variable**:

```
VITE_BACKEND_URL=https://your-actual-backend-url.vercel.app
```

Then redeploy frontend.

---

## WHY SEPARATE IS BETTER

✅ Each app scales independently  
✅ No build conflicts  
✅ Easier to debug  
✅ Vercel free tier supports this  
✅ No 404 errors  

---

**Follow these 3 projects and everything will work! 🚀**
