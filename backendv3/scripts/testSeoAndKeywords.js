import { extractKeywords, generateProductSEO } from '../utils/keywordExtractor.js';
import { buildSitemapXml, syncSitemapFile } from '../utils/sitemapGenerator.js';
import productRouter from '../routes/productRoute.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- 1. Testing SEO Keyword Extraction Algorithm ---');

  const sampleProduct = {
    name: 'Monogram Italian Leather Tote Bag',
    description: 'Exquisite handcrafted genuine Italian leather handbag featuring elegant gold-tone hardware, multiple interior compartments, and a comfortable shoulder strap. The ultimate luxury accessory for work and formal evenings.',
    category: 'Women',
    subCategory: 'Bags',
    colors: ['Black', 'Burgundy']
  };

  const seoData = generateProductSEO(sampleProduct);

  assert(Array.isArray(seoData.keywords) && seoData.keywords.length > 5, 
    `Extracted ${seoData.keywords.length} keywords`);
  
  const keywordsLower = seoData.keywords.map(k => k.toLowerCase());

  assert(keywordsLower.some(k => k.includes('monogram italian leather tote bag')), 
    'Keywords include exact product title');
  assert(keywordsLower.some(k => k.includes('leather')), 
    'Keywords include material keyword "leather"');
  assert(keywordsLower.some(k => k.includes('fantasy luxe')), 
    'Keywords include brand "Fantasy Luxe"');
  assert(keywordsLower.some(k => k.includes('nigeria')), 
    'Keywords include local SEO location "Nigeria"');
  assert(!keywordsLower.includes('the') && !keywordsLower.includes('and') && !keywordsLower.includes('for'), 
    'Stopwords ("the", "and", "for") were successfully filtered out');

  console.log('\n--- 2. Testing SEO Title and Meta Description Generation ---');

  assert(seoData.seoTitle.includes(sampleProduct.name) && seoData.seoTitle.includes('Fantasy Luxe'), 
    `Generated SEO Title: "${seoData.seoTitle}"`);
  assert(seoData.seoDescription.length > 30 && seoData.seoDescription.length <= 165, 
    `Generated SEO Description (${seoData.seoDescription.length} chars): "${seoData.seoDescription}"`);

  console.log('\n--- 3. Testing Dynamic XML Sitemap Generation ---');

  const sitemapXml = await buildSitemapXml();

  assert(sitemapXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 
    'Sitemap XML header generated');
  assert(sitemapXml.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'), 
    'Google Image Sitemap namespace included');
  assert(sitemapXml.includes('<loc>https://fantasyluxe.store/</loc>'), 
    'Homepage URL included in sitemap');
  assert(sitemapXml.includes('<loc>https://fantasyluxe.store/collections</loc>'), 
    'Collections URL included in sitemap');

  console.log('\n--- 4. Testing Product Routes in productRoute ---');

  const registeredRoutes = productRouter.stack
    .filter(r => r.route)
    .map(r => ({
      path: r.route.path,
      methods: Object.keys(r.route.methods)
    }));

  const previewRoute = registeredRoutes.find(r => r.path === '/keywords-preview');
  assert(previewRoute && previewRoute.methods.includes('post'), 
    'POST /keywords-preview route is registered for live admin preview');

  const sitemapRoute = registeredRoutes.find(r => r.path === '/sitemap.xml');
  assert(sitemapRoute && sitemapRoute.methods.includes('get'), 
    'GET /sitemap.xml route is registered for dynamic SEO crawling');

  const backfillRoute = registeredRoutes.find(r => r.path === '/backfill-keywords');
  assert(backfillRoute && backfillRoute.methods.includes('post'), 
    'POST /backfill-keywords route is registered for admin');

  console.log('\n--- 5. Testing Sitemap Sync to public folder ---');
  await syncSitemapFile();
  assert(true, 'syncSitemapFile executed without error');

  console.log(`\n========================================`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
