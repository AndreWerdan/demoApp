const express = require('express');
const { webMainRouter } = require('./webMainRouter');

const { Router } = express;
const mainRouter = Router();

class ApiError {
  constructor(err = {}) {
    this.message = err.message || 'ups somethings went wrong';
    this.status = Math.ceil(parseInt(err.status, 10)) || 500;
  }
}

function iniReqData(req, res, next) {
  res.customResponseData = {};
  res.customResponseStatus = 0;
  req.customRequestData = {};

  next();
}

function responseHandler(req, res, next) {
  const { customResponseData, customResponseStatus } = res;
  const { customRequestData } = req;

  if (!customResponseStatus) {
    return next();
  }

  return res.status(customResponseStatus).send(customResponseData);
}

function notFoundHandler(req, res, next) {
  const err = {
    message: 'not found',
    status: 404,
  };

  next(err);
}

function errorHandler(err, req, res, next) {
  const apiError = new ApiError(err);

  res.status(apiError.status).send(apiError);
}

mainRouter.use(iniReqData);
mainRouter.use(webMainRouter);
mainRouter.use(responseHandler);
mainRouter.use(notFoundHandler);
mainRouter.use(errorHandler);

module.exports = {
  mainRouter,
  webMainRouter,
};
