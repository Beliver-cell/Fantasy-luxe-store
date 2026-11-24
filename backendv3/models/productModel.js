import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true},
    price: { type: Number, required: true},
    description: { type: String, required: true },
    images: { type: [String], required: true },
    public_ids: { type: [String] },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    colors: { type: [String], default: [] },
    bestseller : { type: Boolean},
    stock: { type: Number, default: null, min: 0 },
    keywords: { type: [String], default: [] },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    date: { type: Number, required: true }
})

const productModel =mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;