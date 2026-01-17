import 'dotenv/config';

const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 8000,
  MONGODB_URI: process.env.MONGODB_URI || process.env.mongodb_URI,
  JWT_SECRET: process.env.JWT_SECRET || (isDev ? 'dev-jwt-secret-key-change-in-production' : null),
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME || (isDev ? 'demo' : null),
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || (isDev ? 'demo' : null),
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || (isDev ? 'demo' : null),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5000',
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  FLUTTERWAVE_SECRET_KEY: process.env.FLUTTERWAVE_SECRET_KEY || (isDev ? 'demo' : null),
  VERCEL: process.env.VERCEL,
  CURRENCY: process.env.CURRENCY || 'NGN',
  DELIVERY_CHARGE: process.env.DELIVERY_CHARGE ? parseInt(process.env.DELIVERY_CHARGE) : 500,
  SITE_LOGO_URL: process.env.SITE_LOGO_URL || 'https://fantasyluxe.store/logo.png'
};

const REQUIRED_VARS = isDev ? ['MONGODB_URI'] : [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'CLOUDINARY_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'FRONTEND_URL',
  'FLUTTERWAVE_SECRET_KEY'
];

let missingVars = [];
REQUIRED_VARS.forEach((key) => {
  if (key === 'PORT' && ENV.VERCEL === '1') {
    return;
  }
  if (!ENV[key]) {
    missingVars.push(key);
  }
});

if (missingVars.length > 0) {
  console.error('\x1b[31m[CRITICAL ERROR] Missing required environment variables:\x1b[0m');
  missingVars.forEach(v => console.error(` - ${v}`));
  console.error('The server cannot start without these configurations.');
  if (!isDev) {
    process.exit(1);
  } else {
    console.warn('\x1b[33m[DEV MODE] Continuing with warnings - some features may not work\x1b[0m');
  }
}

// Validate URLs if provided
const validateUrl = (url, name) => {
  if (url && !url.startsWith('http')) {
    console.warn(`\x1b[33m[WARNING] ${name} might be invalid: ${url}\x1b[0m`);
  }
};

validateUrl(ENV.FRONTEND_URL, 'FRONTEND_URL');
validateUrl(ENV.SITE_LOGO_URL, 'SITE_LOGO_URL');

console.log(`\x1b[32m[SUCCESS] Environment verified successfully (${ENV.NODE_ENV} mode)\x1b[0m`);

export default ENV;
