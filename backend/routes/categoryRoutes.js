const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/categoryController');
const { isShopOwner } = require('../middleware/authMiddleware')
const cloudinary = require('cloudinary');
const upload = require('../helper/multer');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

categoryRouter.post('/create-category', categoryController.createCategory)
categoryRouter.get('/get-category', categoryController.getCategory)
categoryRouter.get('/get-only-category', categoryController.getOnlyCategory)
categoryRouter.put('/edit-category/:id', categoryController.editCategory)
categoryRouter.delete('/delete-category/:id', categoryController.deleteCategory)

categoryRouter.get('/category/:name', categoryController.getCategoryWithProducts)


//sub Category
categoryRouter.post('/create-sub-category/:id', upload.array('image'), categoryController.createSubCategory)
categoryRouter.get('/get-sub-category/:id', categoryController.getSubCategory)
categoryRouter.get('/get-sub-category/', categoryController.getOnlySubCategory)
categoryRouter.put('/edit-sub-category/:id', categoryController.editSubCategory)
categoryRouter.delete('/delete-sub-category/:id', categoryController.deleteSubCategory)

module.exports = categoryRouter;