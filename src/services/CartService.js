const prisma = require('../config/database');
const ProductService = require('./ProductService');

class CartService {
  async addItem(clientId, productId, quantity) {
    const product = await ProductService.findById(productId);

    if (product.stock < quantity) {
      throw new Error('Quantidade indisponível em estoque');
    }

    const existingItem = await prisma.cart.findUnique({
      where: {
        clientId_productId: {
          clientId,
          productId
        }
      }
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        throw new Error('Quantidade indisponível em estoque');
      }

      return await prisma.cart.update({
        where: {
          clientId_productId: {
            clientId,
            productId
          }
        },
        data: {
          quantity: newQuantity
        }
      });
    }

    return await prisma.cart.create({
      data: {
        clientId,
        productId,
        quantity
      }
    });
  }

  async findByClient(clientId) {
    const cartItems = await prisma.cart.findMany({
      where: { clientId },
      include: {
        product: true
      }
    });

    return cartItems.map(item => ({
      ...item,
      subtotal: item.quantity * item.product.price
    }));
  }

  async updateQuantity(clientId, productId, quantity) {
    const product = await ProductService.findById(productId);

    if (product.stock < quantity) {
      throw new Error('Quantidade indisponível em estoque');
    }

    return await prisma.cart.update({
      where: {
        clientId_productId: {
          clientId,
          productId
        }
      },
      data: { quantity }
    });
  }

  async removeItem(clientId, productId) {
    await prisma.cart.delete({
      where: {
        clientId_productId: {
          clientId,
          productId
        }
      }
    });
  }

  async clear(clientId) {
    await prisma.cart.deleteMany({
      where: { clientId }
    });
  }
}

module.exports = new CartService(); 