const prisma = require('../../prisma/client');

module.exports = {
  async create(data) {
    return prisma.usuario.create({ data });
  },

  async findByEmail(email) {
    return prisma.usuario.findUnique({ where: { email } });
  }
};
