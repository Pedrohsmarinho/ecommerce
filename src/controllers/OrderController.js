const OrderService = require('../services/OrderService');
const fs = require('fs').promises;
const path = require('path');

class OrderController {
  async create(req, res) {
    try {
      const { items } = req.body;
      const order = await OrderService.create(req.userId, items);
      return res.status(201).json(order);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findAll(req, res) {
    try {
      const orders = await OrderService.findAll({
        ...req.query,
        ...(req.userType !== 'ADMIN' && { clientId: req.userId })
      });
      return res.json(orders);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findById(req, res) {
    try {
      const order = await OrderService.findById(req.params.id);
      
      if (req.userType !== 'ADMIN' && order.clientId !== req.userId) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      return res.json(order);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const order = await OrderService.updateStatus(req.params.id, status);
      return res.json(order);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async generateReport(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Datas inicial e final são obrigatórias' });
      }

      const { report, csvContent } = await OrderService.generateSalesReport(startDate, endDate);

      // Cria diretório de relatórios se não existir
      const reportsDir = path.join(__dirname, '../../reports');
      await fs.mkdir(reportsDir, { recursive: true });

      // Salva arquivo CSV
      await fs.writeFile(path.join(reportsDir, path.basename(report.filePath)), csvContent);

      return res.json(report);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async downloadReport(req, res) {
    try {
      const { id } = req.params;
      const report = await prisma.salesReport.findUnique({ where: { id } });

      if (!report) {
        return res.status(404).json({ error: 'Relatório não encontrado' });
      }

      const filePath = path.join(__dirname, '../../', report.filePath);
      return res.download(filePath);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new OrderController(); 