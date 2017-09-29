const http = require('http');
const { API_SERVER_PORT, API_SERVER_INTERFACE } = require('./config');
const { logger } = require('./services/loggerService');
const { apiServer } = require('./app');
const { ENV } = require('./config');

const httpServer = http.createServer(apiServer);

httpServer.listen(API_SERVER_PORT, API_SERVER_INTERFACE, () => {
  logger.info(`API Server started on http://${API_SERVER_INTERFACE}:${API_SERVER_PORT}`);
  logger.info(`ENV: ${ENV}`);
});
