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
        const { id } = req.params;

        const category = await Category.findOne({
            where: { id: id },
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

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
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
    // Helper function to extract public ID from Cloudinary URL
    const extractPublicIdFromUrl = (url) => {
        const startIndex = url.lastIndexOf("/") + 1;
        const endIndex = url.lastIndexOf(".");
        return url.substring(startIndex, endIndex);
    };

    try {
        const { id } = req.params;
        // Find the category with associated subcategories and products
        const category = await Category.findByPk(id, {
            include: [
                { model: SubCategory, as: 'SubCategories' },
                { model: Product, as: 'Products' },
            ],
        });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Fetch existing image URLs from subcategories and products
        let existingImages = [];
        if (category.SubCategories) {
            category.SubCategories.forEach((subCategory) => {
                existingImages = existingImages.concat(subCategory.image || []);
            });
        }
        if (category.Products) {
            category.Products.forEach((product) => {
                existingImages = existingImages.concat(product.images || []);
            });
        }

        // Delete the category and its associated subcategories and products
        await category.destroy();

        // Delete images from Cloudinary
        for (const url of existingImages) {
            const publicId = extractPublicIdFromUrl(url);

            try {
                await cloudinary.uploader.destroy(publicId);
                console.log(`Deleted image from Cloudinary: ${publicId}`);
            } catch (deleteError) {
                console.error(`Error deleting image from Cloudinary: ${publicId}`, deleteError);
            }
        }

        res.json({ message: 'Category and associated SubCategories/Products deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};



//Sub Category
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
        res.json({ success: true, message: "Category created successfully", subCategory: subCategory });
    } catch (error) {
        console.error("Error:", error); // Add this line for debugging
        res.status(500).json({ error: error.message });
    }
}
const editSubCategory = async (req, res) => {
    // Helper function to extract public ID from Cloudinary URL
    const extractPublicIdFromUrl = (url) => {
        const startIndex = url.lastIndexOf("/") + 1;
        const endIndex = url.lastIndexOf(".");
        return url.substring(startIndex, endIndex);
    };

    try {
        const { name } = req.body;
        const { id } = req.params;

        if (!name) {
            return res.status(400).json({ error: 'Please provide a category name' });
        }

        // Find the subcategory by ID
        const subCategory = await SubCategory.findByPk(id);

        if (!subCategory) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }

        // Fetch existing image URLs
        const existingImages = subCategory.image || [];

        // Update subcategory fields
        await subCategory.update({ name });

        // Handle image update
        if (req.files && req.files.length > 0) {
            const newImages = [];

            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path);
                newImages.push(result.secure_url);
                fs.unlinkSync(file.path); // Uncomment this line if you want to delete the uploaded files locally
            }

            // Replace existing images with new images
            await subCategory.update({ image: newImages });

            // Delete previous images from Cloudinary
            for (const url of existingImages) {
                const publicId = extractPublicIdFromUrl(url);

                try {
                    await cloudinary.uploader.destroy(publicId);
                    console.log(`Deleted image from Cloudinary: ${publicId}`);
                } catch (deleteError) {
                    console.error(`Error deleting image from Cloudinary: ${publicId}`, deleteError);
                }
            }
        }

        // Reload the subcategory to get the updated instance
        const updatedSubCategory = await subCategory.reload();

        res.status(200).json({ message: "Subcategory updated successfully", subCategory: updatedSubCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
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
    getCategoryWithProducts,
    deleteCategory
};
