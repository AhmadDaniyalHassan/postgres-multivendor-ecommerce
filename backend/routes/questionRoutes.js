const express = require('express');
const questionRouter = express.Router();
const questionController = require('../controllers/questionController');
const { verifyToken, isShopOwner } = require('../middleware/authMiddleware')

questionRouter.post('/create-question/:userId', verifyToken, questionController.createQuestion)
questionRouter.get('/get-question/:productId', questionController.getQuestion)
questionRouter.put('/edit-question/:questionId', verifyToken, questionController.editQuestion);
questionRouter.put('/edit-answer/:questionId', isShopOwner, questionController.editAnwerQuestion);
questionRouter.delete('/delete-question/:questionId', isShopOwner, questionController.deleteQuestion);

module.exports = questionRouter;