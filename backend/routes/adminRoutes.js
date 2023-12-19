const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware')

adminRouter.post('/create-admin', adminController.createAdmin)
adminRouter.post('/login-admin', adminController.loginAdmin)
adminRouter.get('/get-admin', isAdmin, adminController.getAdmin)

module.exports = adminRouter;