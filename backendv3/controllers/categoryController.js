import categoryModel from '../models/categoryModel.js';
import productModel from '../models/productModel.js';

const addCategory = async (req, res) => {
    try {
        const { name, type, parent } = req.body;
        
        if (!name) {
            return res.json({ success: false, message: "Category name is required" });
        }

        const existingCategory = await categoryModel.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.json({ success: false, message: "Category already exists" });
        }

        const category = new categoryModel({
            name: name.trim(),
            type: type || 'main',
            parent: parent || null
        });

        await category.save();
        res.json({ success: true, message: "Category added", category });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const listCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, categories });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const removeCategory = async (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.json({ success: false, message: "Category ID is required" });
        }

        const category = await categoryModel.findById(id);
        if (!category) {
            return res.json({ success: false, message: "Category not found" });
        }

        const productsWithCategory = await productModel.countDocuments({ 
            $or: [
                { category: category.name },
                { subCategory: category.name }
            ]
        });

        if (productsWithCategory > 0) {
            return res.json({ 
                success: false, 
                message: `Cannot delete category. ${productsWithCategory} product(s) are using this category.` 
            });
        }

        await categoryModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Category deleted" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id, name, type, parent } = req.body;
        
        if (!id) {
            return res.json({ success: false, message: "Category ID is required" });
        }

        const category = await categoryModel.findById(id);
        if (!category) {
            return res.json({ success: false, message: "Category not found" });
        }

        if (name && name !== category.name) {
            const existingCategory = await categoryModel.findOne({ name: name.trim() });
            if (existingCategory) {
                return res.json({ success: false, message: "Category name already exists" });
            }
            
            await productModel.updateMany(
                { category: category.name },
                { category: name.trim() }
            );
            await productModel.updateMany(
                { subCategory: category.name },
                { subCategory: name.trim() }
            );
        }

        category.name = name ? name.trim() : category.name;
        category.type = type || category.type;
        category.parent = parent !== undefined ? parent : category.parent;
        
        await category.save();
        res.json({ success: true, message: "Category updated", category });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { addCategory, listCategories, removeCategory, updateCategory };
