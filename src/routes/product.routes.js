const { Router } = require('express');
const ProductController = require('../controllers/ProductController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

const productRouter = Router();

productRouter.get('/', ProductController.findAll);
productRouter.get('/:id', ProductController.findById);

// Rotas protegidas - apenas admin
productRouter.use(authMiddleware);
productRouter.use(adminMiddleware);

productRouter.post('/', ProductController.create);
productRouter.put('/:id', ProductController.update);
productRouter.delete('/:id', ProductController.delete);

module.exports = productRouter; 