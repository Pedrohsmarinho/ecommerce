const { Router } = require('express');
const usersRouter = require('./userRoute');

const routes = Router();
routes.use('/users', usersRouter);

module.exports = routes;
