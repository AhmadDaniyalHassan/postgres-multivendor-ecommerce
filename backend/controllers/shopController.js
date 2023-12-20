const ShopUser = require('../models/shop');
const { hashPassword, comparePassword } = require('../helper/passwordHelper');
const JWT = require('jsonwebtoken');

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

module.exports = { getShop, createShop, loginShop };