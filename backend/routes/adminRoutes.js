const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/authMiddleware')

adminRouter.post('/create-admin', adminController.createAdmin)
adminRouter.post('/login-admin', adminController.loginAdmin)
adminRouter.get('/get-admin', isAdmin, adminController.getAdmin)
adminRouter.put('/edit-admin/:adminId', adminController.editAdmin);
adminRouter.delete('/delete-admin/:adminId', adminController.deleteAdmin);

adminRouter.post('/verify-shop/:shopId', isAdmin, adminController.verifyShop);

module.exports = adminRouter;