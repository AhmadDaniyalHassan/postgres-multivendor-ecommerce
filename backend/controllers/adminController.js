const Admin = require('../models/admin');
const { hashPassword, comparePassword } = require('../helper/passwordHelper');
const JWT = require('jsonwebtoken');
const ShopUser = require('../models/shop');
const createAdmin = async (req, res) => {
    try {
        const { username, email, password, address } = req.body;
        const hashedPassword = await hashPassword(password);
        const admin = new Admin({ username, email, password: hashedPassword, address });
        await admin.save()
        res.status(201).send({ message: "admin created successfully", admin: admin })
        console.log(admin)
        console.log(hashedPassword)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).send({ message: "admin not found" })
        }
        const match = await comparePassword(password, admin.password);
        if (!match) {
            return res.status(400).send({ message: "Invalid password" })
        }
        const token = JWT.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).send({ message: "Login successful", token, admin: admin })
        console.log(token)
        console.log(admin)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}


const getAdmin = async (req, res) => {
    try {
        const admin = await Admin.findAll()
        res.status(200).send({ message: "admin fetched successfully", Admin: admin })
        console.log(admin)

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message })
    }
}
const verifyShop = async (req, res) => {
    try {
        const shopId = req.params.shopId;
        const shop = await ShopUser.findByPk(shopId);

        if (!shop) {
            return res.status(404).send({ message: 'Shop not found' });
        }

        // Update the shop's verified status to true
        shop.verified = true;
        await shop.save();

        res.status(200).send({ message: 'Shop verified successfully', shop: shop });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

const editAdmin = async (req, res) => {
    try {
        const adminId = req.params.adminId;
        const { username, email, password, address } = req.body;

        // Find the admin by ID
        const admin = await Admin.findByPk(adminId);

        if (!admin) {
            return res.status(404).send({ message: "Admin not found" });
        }

        // Update admin fields
        admin.username = username || admin.username;
        admin.email = email || admin.email;
        if (password) {
            const hashedPassword = await hashPassword(password);
            admin.password = hashedPassword;
        }
        admin.address = address || admin.address;

        // Save the updated admin
        await admin.save();

        res.status(200).send({ message: "Admin updated successfully", admin: admin });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

const deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.adminId;

        // Find the admin by ID
        const admin = await Admin.findByPk(adminId);

        if (!admin) {
            return res.status(404).send({ message: "Admin not found" });
        }

        // Delete the admin
        await admin.destroy();

        res.status(200).send({ message: "Admin deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

module.exports = { createAdmin, getAdmin, loginAdmin, verifyShop, editAdmin, deleteAdmin };