import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import ENV from './config/serverConfig.js'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import categoryRouter from './routes/categoryRoute.js'
import settingsRouter from './routes/settingsRoute.js'
import subscriberRouter from './routes/subscriberRoute.js'

const app = express()
const port = ENV.PORT

// Trust proxy for Vercel/serverless environment (needed for rate limiting)
app.set('trust proxy', 1);

// Cache the database connection promise for serverless
let connectionPromise = null;

const initializeConnections = async () => {
  if (!connectionPromise) {
    connectionPromise = (async () => {
      try {
        await connectDB();
        connectCloudinary();
      } catch (error) {
        connectionPromise = null; // Reset promise so next request retries
        throw error;
      }
    })();
  }
  return connectionPromise;
};

// Initialize connections will be awaited by middleware
// initializeConnections(); // Removed top-level call for serverless compatibility

// CORS configuration - MUST be first
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow all Vercel preview/production deployments
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Allow fantasyluxe.store domain (with or without www)
    if (origin.includes('fantasyluxe.store')) {
      return callback(null, true);
    }
    
    // Allow Replit domains
    if (origin.includes('.replit.dev') || origin.includes('.repl.co') || origin.includes('.replit.app') || origin.includes('.replit.com')) {
      return callback(null, true);
    }
    
    // Allow any origin from FRONTEND_URL or CORS_ORIGIN env vars
    const frontendUrl = ENV.FRONTEND_URL || '';
    const corsOrigin = ENV.CORS_ORIGIN || '';
    const allowedDomains = [frontendUrl, corsOrigin]
      .filter(Boolean)
      .join(',')
      .split(',')
      .map(d => d.trim().replace(/^https?:\/\//, ''));
    
    if (allowedDomains.some(domain => domain && origin.includes(domain))) {
      return callback(null, true);
    }

    console.warn(`CORS blocked for origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'X-Requested-With']
};

// Apply CORS FIRST - before everything else
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
  frameguard: { action: 'sameorigin' }
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for OPTIONS requests (preflight)
  skip: (req) => req.method === 'OPTIONS'
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
  skip: (req) => req.method === 'OPTIONS'
});

app.use(limiter);
app.use('/api/user/login', loginLimiter);
app.use('/api/user/register', loginLimiter);

// Ensure database connection is ready before handling API requests
app.use('/api', async (req, res, next) => {
  if (req.path === '/health' || req.url === '/health') return next();
  try {
    await initializeConnections();
    next();
  } catch (error) {
    console.error('Connection initialization error:', error);
    res.status(500).json({ success: false, message: 'Database connection error' });
  }
});

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/category', categoryRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/subscriber', subscriberRouter);

// Health check endpoint at /api/health for Vercel
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Vercel health check at root /health
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    name: 'Fantasy Luxe API',
    status: 'running',
    version: '1.0.0',
    endpoints: '/api/*'
  })
})

const escapeXml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

app.get('/sitemap.xml', async (req, res) => {
  try {
    const productModel = (await import('./models/productModel.js')).default;
    const categoryModel = (await import('./models/categoryModel.js')).default;
    
    const products = await productModel.find({});
    const categories = await categoryModel.find({});
    
    const baseUrl = ENV.FRONTEND_URL;
    const today = new Date().toISOString().split('T')[0];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${escapeXml(baseUrl)}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${escapeXml(baseUrl)}/collections</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${escapeXml(baseUrl)}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${escapeXml(baseUrl)}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;

    // Add Categories (Collections)
    categories.forEach(cat => {
      let url = '';
      if (cat.type === 'main') {
        url = `${baseUrl}/collections?category=${encodeURIComponent(cat.name)}`;
      } else if (cat.type === 'sub') {
        url = `${baseUrl}/collections?subCategory=${encodeURIComponent(cat.name)}`;
      }

      if (url) {
        sitemap += `
  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
    });

    // Add Products
    products.forEach(product => {
      const productDate = product.date ? new Date(product.date).toISOString().split('T')[0] : today;
      const escapedName = escapeXml(product.name);
      const escapedImageUrl = product.images && product.images[0] ? escapeXml(product.images[0]) : '';

      sitemap += `
  <url>
    <loc>${escapeXml(baseUrl)}/products/${product._id}</loc>
    <lastmod>${productDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    ${escapedImageUrl ? `<image:image>
      <image:loc>${escapedImageUrl}</image:loc>
      <image:title>${escapedName}</image:title>
    </image:image>` : ''}
  </url>`;
    });

    sitemap += '\n</urlset>';

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
})

app.use((err, req, res, next) => {
  if (ENV.NODE_ENV !== 'production') {
    console.error(err.stack);
  } else {
    console.error(err.name, err.code);
  }
  res.status(500).json({
    success: false,
    message: ENV.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server if not in Vercel serverless
if (!process.env.VERCEL) {
  const port = ENV.PORT || 8000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

// Export for Vercel serverless
export default app;
