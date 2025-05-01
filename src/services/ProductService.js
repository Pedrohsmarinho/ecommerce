const prisma = require('../config/database');

class ProductService {
  async create(data) {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock
      }
    });
    console.log("🚀 ~ ProductService ~ create ~ product:", product)

    return product;
  }

  async findAll(query = {}) {
    const { search, minPrice, maxPrice, inStock } = query;
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (minPrice) {
      where.price = { ...where.price, gte: parseFloat(minPrice) };
    }

    if (maxPrice) {
      where.price = { ...where.price, lte: parseFloat(maxPrice) };
    }

    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    return products;
  }

  async findById(id) {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      throw new Error('Produto não encontrado');
    }

    return product;
  }

  async update(id, data) {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock
      }
    });

    return product;
  }

  async delete(id) {
    await prisma.product.delete({
      where: { id }
    });
  }

  async updateStock(id, quantity, operation = 'decrease') {
    const product = await this.findById(id);

    if (operation === 'decrease' && product.stock < quantity) {
      throw new Error('Quantidade insuficiente em estoque');
    }

    const updatedStock = operation === 'decrease' 
      ? product.stock - quantity 
      : product.stock + quantity;

    return await prisma.product.update({
      where: { id },
      data: { stock: updatedStock }
    });
  }
}

module.exports = new ProductService(); 