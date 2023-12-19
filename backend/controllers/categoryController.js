const Category = require("../models/category");
const SubCategory = require('../models/subCategory')

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
            include: [{ model: SubCategory, as: 'SubCategories' }],
        });
        res.json(categories)
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
        const { name } = req.body
        const category = await Category.findOne({ where: { id: req.params.id } });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const subCategory = await SubCategory.create({ name, CategoryId: category.id });
        res.json(subCategory);
    }
    catch (error) {
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
    deleteCategory
};
