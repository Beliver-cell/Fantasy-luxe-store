# ✨ Fantasy Luxe - Premium Fashion E-Commerce Platform

Fantasy Luxe is an elegant e-commerce platform specializing in luxury fashion and accessories. Built with modern web technologies and a focus on delivering exceptional user experience, the platform offers a seamless shopping journey from browsing to checkout.

---

## 🌟 Key Features

### For Customers
- �️ Curated Collection Browsing
- 🔍 Smart Search & Filtering
- 👤 Personalized User Accounts
- 🛒 Seamless Shopping Experience
- 💳 Secure Payment Integration (Stripe & COD)
- 📱 Responsive Design
- 📦 Order Tracking

### For Administrators
- � Comprehensive Admin Dashboard
- 🎯 Product Management System
- � Order Management
- 🗄️ Inventory Control
- 📸 Image Management via Cloudinary
- 📊 Sales Analytics

---

## 💻 Technical Architecture

### Frontend (`frontendv3/`)
- React.js for dynamic user interface
- Tailwind CSS for elegant styling
- Context API for state management
- Responsive design for all devices
- Newsletter integration
- Real-time search functionality

### Backend (`backendv3/`)
- Node.js & Express for robust API
- MongoDB for flexible data storage
- JWT authentication
- Cloudinary integration
- Secure payment processing
- Order management system

### Admin Panel (`admin/`)
- Dedicated admin interface
- Product management
- Order processing
- Inventory tracking
- User management
- Analytics dashboard

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Beliver-cell/SHop.git
cd "Fantasy Store"
```

### 2. Backend Setup
Navigate to backend directory:
```bash
cd backendv3
npm install
```

Create `.env` file:
```env
PORT=8080
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret
FLUTTERWAVE_SECRET_KEY=your_stripe_secret_key
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to frontend directory:
```bash
cd ../frontendv3
npm install
npm run dev
```

### 4. Admin Panel Setup
Navigate to admin directory:
```bash
cd ../admin
npm install
npm run dev
```

## 🔒 Security Features

- JWT-based authentication
- Secure payment processing
- Encrypted user data
- Protected admin routes
- Secure file uploads
- Input validation and sanitization

## 💳 Payment Integration

- Stripe for card payments
- Cash on Delivery option
- Secure payment processing
- Order verification system

## 📱 Responsive Design

- Mobile-first approach
- Tablet-optimized layouts
- Desktop-enhanced features
- Cross-browser compatibility

---

## � Core Functionalities

### User Features
- Account creation and management
- Wishlist and cart management
- Order history and tracking
- Newsletter subscription
- Easy product navigation
- Secure checkout process

### Admin Features
- Product management (CRUD operations)
- Order processing workflow
- User management
- Analytics and reporting
- Inventory management
- Image upload and management

## 🛠️ Technical Stack

- **Frontend**: React.js, Tailwind CSS, Context API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Image Storage**: Cloudinary
- **Payment Processing**: Flutterwave
- **State Management**: React Context
- **Deployment**: Vercel

## � Project Structure
```
Fantasy Store/
├── frontendv3/        # Customer-facing application
├── backendv3/         # API and server logic
├── admin/             # Administrative dashboard
└── README.md         # Project documentation
```

## � Environment Variables

Three separate .env files are required:

### Backend (.env)
- Database connection
- JWT secret
- Cloudinary credentials
- Flutterwave API keys
- Admin credentials

### Frontend (.env)
- API endpoints
- Public keys
- Environment configs

### Admin Panel (.env)
- API endpoints
- Admin-specific configs
- Authentication details

## 🌟 Future Enhancements

- Enhanced analytics dashboard
- AI-powered recommendations
- Advanced search filters
- Social media integration
- Multiple language support
- Advanced reporting tools

## 📜 License

This project is proprietary and confidential. All rights reserved.

---

Built with ♥️ by Beliver-cell
