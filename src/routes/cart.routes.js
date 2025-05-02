const { Router } = require('express');
const CartController = require('../controllers/CartController');
const { authMiddleware } = require('../middlewares/auth');

const cartRouter = Router();

// Todas as rotas de carrinho requerem autenticação
cartRouter.use(authMiddleware);

cartRouter.get('/', CartController.findByClient);
cartRouter.post('/', CartController.addItem);
cartRouter.put('/:productId', CartController.updateQuantity);
cartRouter.delete('/:productId', CartController.removeItem);
cartRouter.delete('/', CartController.clear);

module.exports = cartRouter;