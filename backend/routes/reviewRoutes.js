const express = require('express');
const reviewRouter = express.Router();
const reviewController = require('../controllers/reviewController');
const { isShopOwner, verifyToken } = require('../middleware/authMiddleware')

reviewRouter.post('/create-review/:userId', verifyToken, reviewController.createReview)
reviewRouter.get('/get-review/:productId', reviewController.getReview)
reviewRouter.put('/edit-review/:reviewId', verifyToken, reviewController.editReview);
reviewRouter.delete('/delete-review/:reviewId', isShopOwner, reviewController.deleteReview);

module.exports = reviewRouter;