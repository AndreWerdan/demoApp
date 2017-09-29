const express = require('express');

const { Router } = express;
const { industryRouter } = require('./industryRouter');
const { homeRouter } = require('./homeRouter');
const { authRouter } = require('./authRouter');
const { menuRouter } = require('./menuRouter');
const { leadsRouter } = require('./leadsRouter');

const webMainRouter = Router();

webMainRouter.use('/industries', industryRouter);
webMainRouter.use('/home', homeRouter);
webMainRouter.use('/auth', authRouter);
webMainRouter.use('/menu', menuRouter);
webMainRouter.use('/leads', leadsRouter);

module.exports = {
  webMainRouter,
};
