import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import productModel from '../models/productModel.js';
import categoryModel from '../models/categoryModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Generate complete XML Sitemap string with Products, Categories, and Images
 */
export async function buildSitemapXml() {
  const baseUrl = 'https://fantasyluxe.store';
  const today = new Date().toISOString().split('T')[0];

  let products = [];
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      products = await productModel.find({}).lean();
    }
  } catch (err) {
    console.warn('Could not query products for sitemap:', err.message);
  }

  let categories = [];
  try {
    if (categoryModel && mongoose.connection && mongoose.connection.readyState === 1) {
      categories = await categoryModel.find({}).lean();
    }
  } catch (err) {
    // optional category query
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Core Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>${baseUrl}/collections</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;

  // Categories
  const categoryNames = new Set(categories.map(c => c.name).filter(Boolean));
  // Add categories found on products as well
  products.forEach(p => {
    if (p.category) categoryNames.add(p.category);
  });

  categoryNames.forEach(cat => {
    xml += `
  <url>
    <loc>${baseUrl}/collections?category=${encodeURIComponent(cat)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>`;
  });

  // Individual Product Pages with Google Image SEO tags
  products.forEach(product => {
    const productDate = product.date ? new Date(product.date).toISOString().split('T')[0] : today;
    const firstImage = product.images && product.images[0] ? product.images[0] : '';
    const cleanDesc = (product.seoDescription || product.description || '').slice(0, 160);

    xml += `
  <url>
    <loc>${baseUrl}/products/${product._id}</loc>
    <lastmod>${productDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`;

    if (firstImage) {
      xml += `
    <image:image>
      <image:loc>${escapeXml(firstImage)}</image:loc>
      <image:title>${escapeXml(product.name)}</image:title>
      <image:caption>${escapeXml(cleanDesc)}</image:caption>
    </image:image>`;
    }

    xml += `
  </url>`;
  });

  xml += `\n</urlset>`;
  return xml;
}

/**
 * Sync the sitemap file in frontend public folder if it exists
 */
export async function syncSitemapFile() {
  try {
    const xml = await buildSitemapXml();
    const publicSitemapPath = path.resolve(__dirname, '../../../frontendv3/public/sitemap.xml');
    if (fs.existsSync(path.dirname(publicSitemapPath))) {
      fs.writeFileSync(publicSitemapPath, xml, 'utf8');
      console.log('Successfully synced frontendv3/public/sitemap.xml with latest products!');
    }
  } catch (err) {
    console.warn('Sitemap file sync non-critical warning:', err.message);
  }
}
