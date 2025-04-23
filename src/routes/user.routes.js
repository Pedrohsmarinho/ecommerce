const { Router } = require('express');
const UserController = require('../controllers/UserController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

const userRouter = Router();

userRouter.post('/register', UserController.register);
userRouter.get('/verify-email', UserController.verifyEmail);
userRouter.post('/login', UserController.authenticate);

module.exports = userRouter; 