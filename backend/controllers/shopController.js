const ShopUser = require('../models/shop');
const { hashPassword, comparePassword } = require('../helper/passwordHelper');
const JWT = require('jsonwebtoken');
const Product = require('../models/product')
const cloudinary = require('cloudinary');

const createShop = async (req, res) => {
    try {
        const { shopName, shopOwner, email, password, productWearHouseAddress, shopHandlerAddress, shopPhoneNumber } = req.body
        const hashedPassword = await hashPassword(password);
        const shop = new ShopUser({ shopName, shopOwner, email, password: hashedPassword, productWearHouseAddress, shopHandlerAddress, shopPhoneNumber, verified: false, });
        await shop.save()
        res.status(201).send({ message: "shop created successfully", message: "You Can Access Your Shop After Admin Approved Your SHop Request", shop: shop })
        console.log(shop)
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
}

const loginShop = async (req, res) => {
    try {
        const { email, password } = req.body;
        const shopUser = await ShopUser.findOne({ email });
        if (!shopUser) {
            return res.status(400).send({ message: "shopUser not found" })
        }
        if (shopUser.verified === false) {
            return res.status(400).send({ message: "Shop Isn't Approved By Admin Please Try Again logging in after 1 to 2 working days" })
        }
        const match = await comparePassword(password, shopUser.password);
        if (!match) {
            return res.status(400).send({ message: "Invalid password" })
        }
        const token = JWT.sign({ id: shopUser.id, role: shopUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).send({ message: "Login successful", token, shopUser: shopUser })
        console.log(token)
        console.log(shopUser)

    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
}

const getShop = async (req, res) => {
    try {
        const shop = await ShopUser.findAll()
        res.status(200).send({ message: "ShopUser fetched successfully", shop: shop })
        console.log(shop)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}

const editShop = async (req, res) => {
    try {
        const shopId = req.params.shopId;
        const { shopName, shopOwner, email, password, productWearHouseAddress, shopHandlerAddress, shopPhoneNumber } = req.body;

        // Find the shop by ID
        const shop = await ShopUser.findByPk(shopId);

        if (!shop) {
            return res.status(404).send({ message: "Shop not found" });
        }

        // Update shop fields
        shop.shopName = shopName || shop.shopName;
        shop.shopOwner = shopOwner || shop.shopOwner;
        shop.email = email || shop.email;
        if (password) {
            const hashedPassword = await hashPassword(password);
            shop.password = hashedPassword;
        }
        shop.productWearHouseAddress = productWearHouseAddress || shop.productWearHouseAddress;
        shop.shopHandlerAddress = shopHandlerAddress || shop.shopHandlerAddress;
        shop.shopPhoneNumber = shopPhoneNumber || shop.shopPhoneNumber;

        // Save the updated shop
        await shop.save();

        res.status(200).send({ message: "Shop updated successfully", shop: shop });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

const deleteShop = async (req, res) => {
    // Helper function to extract public ID from Cloudinary URL
    const extractPublicIdFromUrl = (url) => {
        const startIndex = url.lastIndexOf("/") + 1;
        const endIndex = url.lastIndexOf(".");
        return url.substring(startIndex, endIndex);
    };

    try {
        const shopId = req.params.shopId;

        // Find the shop by ID with associated products
        const shop = await ShopUser.findByPk(shopId, {
            include: [{ model: Product, as: 'Products' }],
        });

        if (!shop) {
            return res.status(404).send({ message: "Shop not found" });
        }

        // Fetch existing image URLs from products
        let existingImages = [];
        if (shop.Products) {
            shop.Products.forEach((product) => {
                existingImages = existingImages.concat(product.images || []);
            });
        }

        // Delete the shop and its associated products
        await shop.destroy();

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

        res.status(200).send({ message: "Shop and associated Products deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
};
module.exports = { getShop, createShop, loginShop, editShop, deleteShop };