const { Router } = require('express');
const OrderController = require('../controllers/OrderController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

const orderRouter = Router();

// Todas as rotas de pedidos requerem autenticação
orderRouter.use(authMiddleware);

// Rotas para clientes e admins
orderRouter.post('/', OrderController.create);
orderRouter.get('/', OrderController.findAll);
orderRouter.get('/:id', OrderController.findById);

// Rotas apenas para admin
orderRouter.put('/:id/status', adminMiddleware, OrderController.updateStatus);
orderRouter.get('/reports/sales', adminMiddleware, OrderController.generateReport);
orderRouter.get('/reports/:id/download', adminMiddleware, OrderController.downloadReport);

module.exports = orderRouter; 