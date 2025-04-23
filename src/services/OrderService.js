const prisma = require('../config/database');
const ProductService = require('./ProductService');

class OrderService {
  async create(clientId, items) {
    // Verifica estoque e calcula total
    let total = 0;
    for (const item of items) {
      const product = await ProductService.findById(item.productId);
      
      if (product.stock < item.quantity) {
        throw new Error(`Produto ${product.name} sem estoque suficiente`);
      }

      total += product.price * item.quantity;
    }

    // Cria o pedido e os itens em uma transação
    const order = await prisma.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: {
          clientId,
          status: 'RECEIVED',
          total,
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.quantity * item.unitPrice
            }))
          }
        },
        include: {
          items: true
        }
      });

      // Atualiza o estoque dos produtos
      for (const item of items) {
        await ProductService.updateStock(item.productId, item.quantity, 'decrease');
      }

      return order;
    });

    return order;
  }

  async findAll(query = {}) {
    const { clientId, status, startDate, endDate } = query;

    const where = {};

    if (clientId) {
      where.clientId = clientId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.orderDate = {};
      if (startDate) {
        where.orderDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.orderDate.lte = new Date(endDate);
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true
          }
        },
        client: true
      },
      orderBy: {
        orderDate: 'desc'
      }
    });

    return orders;
  }

  async findById(id) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        client: true
      }
    });

    if (!order) {
      throw new Error('Pedido não encontrado');
    }

    return order;
  }

  async updateStatus(id, status) {
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    return order;
  }

  async generateSalesReport(startDate, endDate) {
    const orders = await prisma.order.findMany({
      where: {
        orderDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        },
        status: {
          in: ['DELIVERED']
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Agrupa vendas por produto
    const salesByProduct = orders.reduce((acc, order) => {
      order.items.forEach(item => {
        const { productId, product, quantity, unitPrice } = item;
        if (!acc[productId]) {
          acc[productId] = {
            productName: product.name,
            quantity: 0,
            total: 0
          };
        }
        acc[productId].quantity += quantity;
        acc[productId].total += quantity * unitPrice;
      });
      return acc;
    }, {});

    // Calcula totais
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalProducts = Object.values(salesByProduct).reduce((sum, item) => sum + item.quantity, 0);

    // Gera CSV
    const csvContent = Object.entries(salesByProduct)
      .map(([productId, data]) => {
        return `${data.productName},${data.quantity},${data.total}`;
      })
      .join('\n');

    const filePath = `reports/sales-${startDate}-${endDate}.csv`;

    // Cria relatório no banco
    const report = await prisma.salesReport.create({
      data: {
        period: new Date(startDate),
        totalSales,
        productsSold: totalProducts,
        filePath
      }
    });

    return {
      report,
      csvContent
    };
  }
}

module.exports = new OrderService(); 