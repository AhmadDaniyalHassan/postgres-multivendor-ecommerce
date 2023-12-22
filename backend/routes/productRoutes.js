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

productRouter.post('/create-product', upload.array('images'), isShopOwner, productController.createProduct)
productRouter.get('/get-product/', productController.getProduct)
productRouter.get('/get-single-product/:productId', productController.getSingleProduct)

productRouter.put('/edit-product/:productId', isShopOwner, upload.array('images'), productController.editProduct);
productRouter.delete('/delete-product/:productId', isShopOwner, productController.deleteProduct);

module.exports = productRouter;