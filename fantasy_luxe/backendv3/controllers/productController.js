import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_API_KEY, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY
  });
  

// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

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

        // ✅ Create product data object
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === "true" ? true:false,
            images: imagesUrl,
            public_ids: imagesPublicIds,
            date: Date.now(),
        };

        // ✅ Save product in DB
        const product = new productModel(productData);
        await product.save();
        res.json({ success: true, message: "Product Added" });

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

export { listProducts, addProduct, removeProduct, singleProduct, removeCollection }