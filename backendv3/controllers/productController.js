import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';
import ENV from '../config/serverConfig.js';
import { generateProductSEO } from '../utils/keywordExtractor.js';
import { buildSitemapXml, syncSitemapFile } from '../utils/sitemapGenerator.js';

cloudinary.config({ 
    cloud_name: ENV.CLOUDINARY_NAME, 
    api_key: ENV.CLOUDINARY_API_KEY, 
    api_secret: ENV.CLOUDINARY_API_SECRET
  });
  

// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, colors, bestseller, keywords } = req.body;

        // ✅ Ensure req.files exists
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ success: false, message: "No images uploaded" });
        }

        // ✅ Extract images safely
        const image1 = req.files.image1?.[0];
        const image2 = req.files.image2?.[0];
        const image3 = req.files.image3?.[0];
        const image4 = req.files.image4?.[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // ✅ Upload images to Cloudinary
        let imagesUrl = [];
        let imagesPublicIds = [];
        await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type:'image'});
                imagesUrl.push(result.secure_url);
                imagesPublicIds.push(result.public_id);
            })
        );

        // ✅ Run SEO algorithm: extract keywords from description, name, category, and attributes
        const parsedColors = colors ? (typeof colors === 'string' ? JSON.parse(colors) : colors) : [];
        const seoData = generateProductSEO({
            name,
            description,
            category,
            subCategory,
            price: Number(price),
            colors: parsedColors
        });

        // Use custom keywords if provided, or merge with algorithmic keywords
        let finalKeywords = seoData.keywords;
        if (keywords) {
            const customKwList = typeof keywords === 'string' 
                ? keywords.split(',').map(k => k.trim()).filter(Boolean)
                : (Array.isArray(keywords) ? keywords : []);
            if (customKwList.length > 0) {
                // Merge custom keywords at the front, preserving extracted ones
                finalKeywords = Array.from(new Set([...customKwList, ...seoData.keywords]));
            }
        }

        // ✅ Create product data object with SEO keywords, title, and description
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            colors: parsedColors,
            bestseller: bestseller === "true" || bestseller === true,
            images: imagesUrl,
            public_ids: imagesPublicIds,
            keywords: finalKeywords,
            seoTitle: req.body.seoTitle || seoData.seoTitle,
            seoDescription: req.body.seoDescription || seoData.seoDescription,
            stock: req.body.stock !== undefined && req.body.stock !== '' && !isNaN(Number(req.body.stock)) ? Number(req.body.stock) : null,
            date: Date.now(),
        };

        // ✅ Save product in DB
        const product = new productModel(productData);
        await product.save();

        // ✅ Auto-register in Google SEO Sitemap
        syncSitemapFile().catch(err => console.warn('Background sitemap sync notice:', err.message));

        res.json({ 
            success: true, 
            message: "Product Added & Registered for SEO Indexing",
            productId: product._id,
            keywords: finalKeywords,
            seoTitle: productData.seoTitle
        });

    } 
    catch (error){
        res.json({success:false, message: error.message})
    }
}

// function for list product
const listProducts = async (req, res) => {
    try{
        const products = await productModel.find({});
        res.json({success:true, products})
    }
    catch (error){
        res.json({success:false, message: error.message})
    }
}

// function for remove product
const removeProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.body.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        // delete images from Cloudinary if public_ids exist
        if (product.public_ids && product.public_ids.length > 0) {
            await Promise.all(
                product.public_ids.map(async (pid) => {
                    try {
                        await cloudinary.uploader.destroy(pid);
                    } catch (e) {
                        // Cloudinary destroy error - non-critical
                    }
                })
            );
        }

        await productModel.findByIdAndDelete(req.body.id);
        // Refresh sitemap
        syncSitemapFile().catch(err => console.warn('Background sitemap sync notice:', err.message));
        res.json({ success: true, message: "Product removed"})
    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success: true, product})
    }
    catch (error){
        res.json({success:false, message: error.message})
    }
}
// function to remove all products in a collection/category
const removeCollection = async (req, res) => {
    try {
        const { category } = req.body;
        if (!category) return res.status(400).json({ success: false, message: "Category is required" });
        const products = await productModel.find({ category });

        // delete images for each product
        await Promise.all(
            products.map(async (product) => {
                if (product.public_ids && product.public_ids.length > 0) {
                    await Promise.all(
                        product.public_ids.map(async (pid) => {
                            try {
                                await cloudinary.uploader.destroy(pid);
                            } catch (e) {
                                // Cloudinary destroy error - non-critical
                            }
                        })
                    );
                }
            })
        );

        const result = await productModel.deleteMany({ category });
        res.json({ success: true, message: `Removed ${result.deletedCount} product(s) from collection ${category}` });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// function for updating product
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subCategory, sizes, colors, bestseller, stock, keywords, seoTitle, seoDescription } = req.body;

        if (!id) {
            return res.json({ success: false, message: "Product ID is required" });
        }

        const parsedColors = colors ? (typeof colors === 'string' ? JSON.parse(colors) : colors) : undefined;

        // Auto re-generate keywords and SEO metadata if description/name/category provided
        const seoData = generateProductSEO({
            name: name || '',
            description: description || '',
            category: category || '',
            subCategory: subCategory || '',
            price: Number(price) || 0,
            colors: parsedColors || []
        });

        let finalKeywords = seoData.keywords;
        if (keywords) {
            const customKwList = typeof keywords === 'string' 
                ? keywords.split(',').map(k => k.trim()).filter(Boolean)
                : (Array.isArray(keywords) ? keywords : []);
            if (customKwList.length > 0) {
                finalKeywords = Array.from(new Set([...customKwList, ...seoData.keywords]));
            }
        }

        const updateData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            bestseller: bestseller === "true" || bestseller === true,
            keywords: finalKeywords,
            seoTitle: seoTitle || seoData.seoTitle,
            seoDescription: seoDescription || seoData.seoDescription,
            stock: stock !== undefined && stock !== '' && !isNaN(Number(stock)) ? Number(stock) : null,
        };

        if (sizes) updateData.sizes = JSON.parse(sizes);
        if (parsedColors !== undefined) updateData.colors = parsedColors;

        // Handle Image Updates if files are provided
        if (req.files && Object.keys(req.files).length > 0) {
            const product = await productModel.findById(id);
            let imagesUrl = [...product.images];
            let imagesPublicIds = [...(product.public_ids || [])];

            // Helper to replace image at index
            const replaceImage = async (file, index) => {
                 if (file) {
                    // Delete old image if it exists and has a public_id
                    if (imagesPublicIds[index]) {
                        try { await cloudinary.uploader.destroy(imagesPublicIds[index]); } catch (e) {}
                    }
                    // Upload new
                    let result = await cloudinary.uploader.upload(file.path, {resource_type:'image'});
                    imagesUrl[index] = result.secure_url;
                    imagesPublicIds[index] = result.public_id;
                 }
            }

            if (req.files.image1) await replaceImage(req.files.image1[0], 0);
            if (req.files.image2) await replaceImage(req.files.image2[0], 1);
            if (req.files.image3) await replaceImage(req.files.image3[0], 2);
            if (req.files.image4) await replaceImage(req.files.image4[0], 3);

            // Filter out any undefineds if the array was sparse
            updateData.images = imagesUrl.filter(x => x);
            updateData.public_ids = imagesPublicIds.filter(x => x);
        }

        await productModel.findByIdAndUpdate(id, updateData);
        // Refresh sitemap
        syncSitemapFile().catch(err => console.warn('Background sitemap sync notice:', err.message));
        res.json({ success: true, message: "Product Updated", keywords: finalKeywords });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Preview extracted keywords in real-time (for Admin UI while typing)
const previewKeywords = async (req, res) => {
    try {
        const { name, description, category, subCategory, colors } = req.body;
        const parsedColors = colors ? (typeof colors === 'string' ? JSON.parse(colors) : colors) : [];
        const seoData = generateProductSEO({
            name: name || '',
            description: description || '',
            category: category || '',
            subCategory: subCategory || '',
            colors: parsedColors
        });
        res.json({ success: true, ...seoData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Serve dynamic XML Sitemap with all indexed products & categories
const getSitemap = async (req, res) => {
    try {
        const xml = await buildSitemapXml();
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        res.status(500).send('Error generating sitemap');
    }
}

// Backfill keywords for any existing products in DB
const backfillKeywords = async (req, res) => {
    try {
        const products = await productModel.find({});
        let updatedCount = 0;
        for (const prod of products) {
            if (!prod.keywords || prod.keywords.length === 0 || !prod.seoTitle) {
                const seo = generateProductSEO({
                    name: prod.name,
                    description: prod.description,
                    category: prod.category,
                    subCategory: prod.subCategory,
                    colors: prod.colors
                });
                prod.keywords = seo.keywords;
                prod.seoTitle = seo.seoTitle;
                prod.seoDescription = seo.seoDescription;
                await prod.save();
                updatedCount++;
            }
        }
        await syncSitemapFile();
        res.json({ success: true, message: `Backfilled keywords for ${updatedCount} products`, total: products.length });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export { 
    listProducts, 
    addProduct, 
    removeProduct, 
    singleProduct, 
    removeCollection, 
    updateProduct,
    previewKeywords,
    getSitemap,
    backfillKeywords
}