const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware')

userRouter.post('/create-user', userController.createUser)
userRouter.post('/login', userController.loginUser)
userRouter.get('/get-user', verifyToken, userController.getUser)


module.exports = userRouter;