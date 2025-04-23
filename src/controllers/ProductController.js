const ProductService = require('../services/ProductService');

class ProductController {
  async create(req, res) {
    try {
      const product = await ProductService.create(req.body);
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findAll(req, res) {
    try {
      const products = await ProductService.findAll(req.query);
      return res.json(products);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findById(req, res) {
    try {
      const product = await ProductService.findById(req.params.id);
      return res.json(product);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const product = await ProductService.update(req.params.id, req.body);
      return res.json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await ProductService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ProductController(); 