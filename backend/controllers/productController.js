const Product = require('../models/product');
const cloudinary = require('cloudinary');
const Category = require('../models/category');
const ShopUser = require('../models/shop');
const SubCategory = require('../models/subCategory');
const createProduct = async (req, res) => {
    try {
        const { productName, productDescription, inStock, price, CategoryId, shopUserId } = req.body;

        // Validate required fields
        if (!productName || !productDescription || !inStock || !price || !CategoryId || !shopUserId) {
            return res.status(400).json({ success: false, message: "Required fields are missing." });
        }
        // Create the product
        const product = await Product.create({
            productName,
            productDescription,
            inStock,
            price,
            CategoryId,
            shopUserId,
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
                        { model: SubCategory, attributes: ['id', 'name'] }, // Include SubCategory data through Category
                    ],
                },
                {
                    model: ShopUser,
                    attributes: ['id', 'shopName', 'shopOwner', 'shopHandlerAddress', 'shopPhoneNumber'],
                },
            ],
        });

        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

module.exports = { createProduct, getProduct };