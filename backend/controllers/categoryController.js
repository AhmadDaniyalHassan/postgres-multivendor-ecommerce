const Category = require("../models/category");
const SubCategory = require('../models/subCategory')
const Product = require('../models/product')
const fs = require('fs');
const cloudinary = require('cloudinary');

//Normal Category
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.create({ name });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getOnlyCategory = async (req, res) => {
    try {
        const categories = await Category.findAll({})
        res.json(categories);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}
const getCategory = async (req, res) => {
    try {
        const categories = await Category.findAll({
            include: [
                {
                    model: SubCategory,
                    as: 'SubCategories',
                    include: [
                        {
                            model: Product,
                            as: 'Products',
                        },
                    ],
                },
            ],
        });

        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const editCategory = async (req, res) => {
    try {
        const { name } = req.body; // Add this line
        const { id } = req.params;
        console.log(id, name)
        if (!name) {
            return res.status(400).json({ error: 'Please provide a category name' });
        }

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        category.name = name;
        await category.save();

        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the category with associated subcategories
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        // Delete the category and its associated subcategories
        await category.destroy();
        // Delete the subcategories
        await SubCategory.destroy({ where: { categoryId: id } });
        // Return a success message

        res.json({ message: 'Category and associated SubCategories deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
//Bub Category
const getSubCategory = async (req, res) => {
    try {
        const subCategories = await SubCategory.findAll({
            where: { categoryId: req.params.id },
            include: [{ model: Category, as: 'category' }],
        });

        res.json(subCategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const getOnlySubCategory = async (req, res) => {
    try {
        const subCategories = await SubCategory.findAll({})

        res.json(subCategories);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}
const createSubCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const image = [];
        const category = await Category.findOne({ where: { id: req.params.id } });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path);
            image.push(result.secure_url);
            fs.unlinkSync(file.path); // Uncomment this line if you want to delete the uploaded files locally
        }

        const subCategory = await SubCategory.create({ name, CategoryId: category.id, image: image });
        console.log("Created SubCategory:", subCategory); // Add this line for debugging
        res.json({ success: true, message: "Category created successfully", subCategory: subCategory });
    } catch (error) {
        console.error("Error:", error); // Add this line for debugging
        res.status(500).json({ error: error.message });
    }
}
const editSubCategory = async (req, res) => {
    try {
        const { name } = req.body; // Add this line
        const { id } = req.params;
        console.log(id, name)
        if (!name) {
            return res.status(400).json({ error: 'Please provide a category name' });
        }

        const category = await SubCategory.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        category.name = name;
        await category.save();

        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const deleteSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await SubCategory.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        await category.destroy();
        res.json({ message: 'SubCategory deleted successfully' });

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}


const getCategoryWithProducts = async (req, res) => {
    try {
        const subcategoryName = req.params.name;
        console.log('Subcategory Name:', subcategoryName); // Add this line for debugging

        if (!subcategoryName) {
            return res.status(400).json({ success: false, message: 'Subcategory name is missing in the request parameters' });
        }

        const products = await Product.findAll({
            include: [
                {
                    model: SubCategory,
                    where: { name: subcategoryName },
                },
            ],
        });

        if (!products || products.length === 0) {
            return res.status(404).json({ success: false, message: 'Products not found for the specified subcategory' });
        }

        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.error("Error in getProductsBySubcategoryName:", error);
        res.status(500).send({
            success: false,
            message: "Error in fetching products by subcategory name",
            error: error.message,
        });
    }
};


module.exports = {
    createCategory,
    getCategory,
    getOnlyCategory,
    getSubCategory,
    getOnlySubCategory,
    createSubCategory,
    editCategory,
    editSubCategory,
    deleteSubCategory,
    getCategoryWithProducts,
    deleteCategory
};
