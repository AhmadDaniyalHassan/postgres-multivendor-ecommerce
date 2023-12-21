const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

userRouter.post('/create-user', userController.createUser);
userRouter.post('/login', userController.loginUser);
userRouter.get('/get-user', verifyToken, userController.getUser);
userRouter.put('/edit-user/:userId', verifyToken, userController.editUser);
userRouter.delete('/delete-user/:userId', verifyToken, userController.deleteUser);

module.exports = userRouter;