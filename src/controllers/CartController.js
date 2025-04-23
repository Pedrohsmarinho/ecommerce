const CartService = require('../services/CartService');

class CartController {
  async addItem(req, res) {
    try {
      const { productId, quantity } = req.body;
      const item = await CartService.addItem(req.userId, productId, quantity);
      return res.status(201).json(item);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findByClient(req, res) {
    try {
      const items = await CartService.findByClient(req.userId);
      return res.json(items);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updateQuantity(req, res) {
    try {
      const { quantity } = req.body;
      const item = await CartService.updateQuantity(
        req.userId,
        req.params.productId,
        quantity
      );
      return res.json(item);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async removeItem(req, res) {
    try {
      await CartService.removeItem(req.userId, req.params.productId);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async clear(req, res) {
    try {
      await CartService.clear(req.userId);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new CartController(); 