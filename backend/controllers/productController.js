const Product = require('../models/product');
const cloudinary = require('cloudinary');
const Category = require('../models/category');
const ShopUser = require('../models/shop');
const SubCategory = require('../models/subCategory');
const fs = require('fs');
const Review = require('../models/review');
const Question = require('../models/question');
const User = require('../models/user');
const createProduct = async (req, res) => {
    try {
        const { productName, productDescription, inStock, price, CategoryId, shopUserId, SubCategoryId, quantity } = req.body;
        const images = []
        // Validate required fields
        if (!productName || !productDescription || !inStock || !price || !CategoryId || !shopUserId || !SubCategoryId || !quantity || !images) {
            return res.status(400).json({ success: false, message: "Required fields are missing." });
        }
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path);
            images.push(result.secure_url);
            fs.unlinkSync(file.path); // Uncomment this line if you want to delete the uploaded files locally
        }
        if (images.length === 0) {
            return res.status(400).json({ success: false, message: "At least one image is required." });
        }
        // Create the product
        const product = await Product.create({
            productName,
            productDescription,
            inStock,
            price,
            CategoryId,
            shopUserId,
            SubCategoryId,
            quantity,
            images: images
        });

        res.status(201).json({ success: true, message: "Product created successfully", product: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
}
const getProduct = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name'],
                    include: [
                        { model: SubCategory, attributes: ['id', 'name', 'image'] }, // Include SubCategory data through Category
                    ],
                },
                {
                    model: ShopUser,
                    attributes: ['id', 'shopName', 'shopOwner', 'shopHandlerAddress', 'shopPhoneNumber'],
                },
                {
                    model: Review,
                    attributes: ['id', 'rating', 'review'],
                },
                {
                    model: Question,
                    attributes: ['id', 'question', 'answer'],
                }
            ],
        });

        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

const getSingleProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        const product = await Product.findOne({
            where: { id: productId },
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name'],
                    include: [
                        { model: SubCategory, attributes: ['id', 'name', 'image'] },
                    ],
                },
                {
                    model: ShopUser,
                    attributes: ['id', 'shopName', 'shopOwner', 'shopHandlerAddress', 'shopPhoneNumber'],
                },
                {
                    model: Review,
                    attributes: ['id', 'rating', 'review', 'createdAt'],
                    include: [
                        { model: User, attributes: ['id', 'username'] }, // Include user information for reviews
                    ],
                },
                {
                    model: Question,
                    attributes: ['id', 'question', 'answer', 'createdAt'],
                    include: [
                        { model: User, attributes: ['id', 'username'] }, // Include user information for questions
                    ],
                },
            ],
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in fetching product', error });
    }
}

const extractPublicIdFromUrl = (url) => {
    const startIndex = url.lastIndexOf("/") + 1;
    const endIndex = url.lastIndexOf(".");
    return url.substring(startIndex, endIndex);
};
const editProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { productName, productDescription, inStock, price, CategoryId, SubCategoryId, quantity } = req.body;

        // Find the product by ID
        let product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        // Fetch existing images URLs
        const existingImages = product.images || [];

        // Update product fields
        await product.update({
            productName: productName || product.productName,
            productDescription: productDescription || product.productDescription,
            inStock: inStock || product.inStock,
            price: price || product.price,
            CategoryId: CategoryId || product.CategoryId,
            SubCategoryId: SubCategoryId || product.SubCategoryId,
            quantity: quantity || product.quantity,
        });

        // Handle image update
        if (req.files && req.files.length > 0) {
            const newImages = [];
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path);
                newImages.push(result.secure_url);
                fs.unlinkSync(file.path); // Uncomment this line if you want to delete the uploaded files locally
            }
            // Replace existing images with new images
            await product.update({ images: newImages });
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
        // Reload the product to get the updated instance
        const updatedProduct = await product.reload();

        res.status(200).send({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        // Find the product by ID
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        const extractPublicIdFromUrl = (url) => {
            const startIndex = url.lastIndexOf("/") + 1;
            const endIndex = url.lastIndexOf(".");
            return url.substring(startIndex, endIndex);
        };
        // Fetch existing images URLs
        const existingImages = product.images || [];
        // Delete the product
        await product.destroy();
        // Delete Cloudinary images associated with the product
        for (const url of existingImages) {
            const publicId = extractPublicIdFromUrl(url);
            try {
                await cloudinary.uploader.destroy(publicId);
                console.log(`Deleted image from Cloudinary: ${publicId}`);
            } catch (deleteError) {
                console.error(`Error deleting image from Cloudinary: ${publicId}`, deleteError);
            }
        }
        res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};

module.exports = { createProduct, getProduct, editProduct, deleteProduct, getSingleProduct };