const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/categoryController');


categoryRouter.post('/create-category', categoryController.createCategory)
categoryRouter.get('/get-category', categoryController.getCategory)
categoryRouter.get('/get-only-category', categoryController.getOnlyCategory)
categoryRouter.put('/edit-category/:id', categoryController.editCategory)
categoryRouter.delete('/delete-category/:id', categoryController.deleteCategory)


//sub Category
categoryRouter.post('/create-sub-category/:id', categoryController.createSubCategory)
categoryRouter.get('/get-sub-category/:id', categoryController.getSubCategory)
categoryRouter.get('/get-sub-category/', categoryController.getOnlySubCategory)
categoryRouter.put('/edit-sub-category/:id', categoryController.editSubCategory)
categoryRouter.delete('/delete-sub-category/:id', categoryController.deleteSubCategory)

module.exports = categoryRouter;