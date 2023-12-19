const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Admin = require('../models/admin');
const ShopUser = require('../models/shop');
exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).send({ success: false, message: 'Unauthorized Access' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).send({ success: false, message: 'Unauthorized Access' });
        }
        req.user = user;
        return next();
    } catch (error) {
        console.error(error);
        return res.status(401).send({ success: false, error, message: 'Error in Token Verification' });
    }
};
exports.isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).send({ success: false, message: 'Unauthorized Access - Token missing' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findByPk(decoded.id);

        if (!admin || admin.role !== 1) {
            return res.status(403).send({ success: false, message: 'Unauthorized Access - Admin role required' });
        }
        req.admin = admin;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).send({ success: false, error, message: 'Error in Admin Authentication Middleware' });
    }
};
exports.isShopOwner = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).send({ success: false, message: 'Unauthorized Access - Token missing' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const shop = await ShopUser.findByPk(decoded.id);
        if (!shop || shop.role !== 2) {
            return res.status(403).send({ success: false, message: 'Unauthorized Access - Shop role required' });
        }
        req.shop = shop;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).send({ success: false, error, message: 'Error in Shop Authentication Middleware' });
    }
};