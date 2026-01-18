import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String, enum: ['main', 'sub'], default: 'main' },
    parent: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

const categoryModel = mongoose.models.category || mongoose.model("category", categorySchema);

export default categoryModel;
