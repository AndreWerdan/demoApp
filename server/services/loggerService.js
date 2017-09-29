const { Logger, transports } = require('winston');
const { Console } = transports;
const logger = new Logger({
  transports: [new Console()],
});

module.exports = {
  logger,
};