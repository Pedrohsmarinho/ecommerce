const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


prisma.$connect()
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    });
module.exports = prisma;
