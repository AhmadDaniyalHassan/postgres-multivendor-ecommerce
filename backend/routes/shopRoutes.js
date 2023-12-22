const express = require('express');
const shopRouter = express.Router();
const shopController = require('../controllers/shopController');
const { isShopOwner } = require('../middleware/authMiddleware')

shopRouter.post('/create-shop', shopController.createShop)
shopRouter.post('/login-shop', shopController.loginShop)
shopRouter.get('/get-shop', isShopOwner, shopController.getShop)
shopRouter.put('/edit-shop/:shopId', isShopOwner, shopController.editShop);
shopRouter.delete('/delete-shop/:shopId', isShopOwner, shopController.deleteShop);

module.exports = shopRouter;