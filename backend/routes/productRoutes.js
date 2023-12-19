const express = require('express');
const productRouter = express.Router();
const productController = require('../controllers/productController');
const cloudinary = require('cloudinary');
const { isShopOwner } = require('../middleware/authMiddleware')
const upload = require('../helper/multer');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

productRouter.post('/create-product', isShopOwner, productController.createProduct)
productRouter.get('/get-product', isShopOwner, productController.getProduct)

module.exports = productRouter;