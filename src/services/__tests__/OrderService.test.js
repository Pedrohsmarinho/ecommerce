const OrderService = require('../OrderService');
const ProductService = require('../ProductService');
const prisma = require('../../config/database');

jest.mock('../../config/database');
jest.mock('../ProductService');

describe('OrderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um pedido com sucesso', async () => {
      const mockProduct = {
        id: '1',
        name: 'Produto Teste',
        price: 100,
        stock: 10
      };

      const mockOrder = {
        id: '1',
        clientId: 'client-1',
        status: 'RECEIVED',
        total: 200,
        items: [
          {
            id: '1',
            productId: '1',
            quantity: 2,
            unitPrice: 100,
            subtotal: 200
          }
        ]
      };

      ProductService.findById.mockResolvedValue(mockProduct);
      ProductService.updateStock.mockResolvedValue({ ...mockProduct, stock: 8 });
      prisma.$transaction.mockImplementation(callback => callback(prisma));
      prisma.order.create.mockResolvedValue(mockOrder);

      const result = await OrderService.create('client-1', [
        {
          productId: '1',
          quantity: 2,
          unitPrice: 100
        }
      ]);

      expect(result).toEqual(mockOrder);
      expect(ProductService.updateStock).toHaveBeenCalledWith('1', 2, 'decrease');
    });

    it('deve lançar erro se não houver estoque suficiente', async () => {
      const mockProduct = {
        id: '1',
        name: 'Produto Teste',
        price: 100,
        stock: 1
      };

      ProductService.findById.mockResolvedValue(mockProduct);

      await expect(
        OrderService.create('client-1', [
          {
            productId: '1',
            quantity: 2,
            unitPrice: 100
          }
        ])
      ).rejects.toThrow('Produto Produto Teste sem estoque suficiente');
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de pedidos filtrada', async () => {
      const mockOrders = [
        {
          id: '1',
          clientId: 'client-1',
          status: 'DELIVERED',
          total: 200
        }
      ];

      prisma.order.findMany.mockResolvedValue(mockOrders);

      const result = await OrderService.findAll({
        clientId: 'client-1',
        status: 'DELIVERED'
      });

      expect(result).toEqual(mockOrders);
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            clientId: 'client-1',
            status: 'DELIVERED'
          }
        })
      );
    });
  });

  describe('generateSalesReport', () => {
    it('deve gerar relatório de vendas', async () => {
      const mockOrders = [
        {
          id: '1',
          total: 200,
          items: [
            {
              productId: '1',
              product: { name: 'Produto 1' },
              quantity: 2,
              unitPrice: 100
            }
          ]
        }
      ];

      const mockReport = {
        id: '1',
        period: new Date(),
        totalSales: 200,
        productsSold: 2,
        filePath: 'reports/sales-2024-01-01-2024-01-31.csv'
      };

      prisma.order.findMany.mockResolvedValue(mockOrders);
      prisma.salesReport.create.mockResolvedValue(mockReport);

      const result = await OrderService.generateSalesReport('2024-01-01', '2024-01-31');

      expect(result).toEqual({
        report: mockReport,
        csvContent: expect.any(String)
      });
      expect(prisma.salesReport.create).toHaveBeenCalled();
    });
  });
}); 