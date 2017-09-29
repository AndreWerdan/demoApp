const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { PRODUCTION } = require('./config');
const { mainRouter } = require('./routes');
const { sessionMiddleware } = require('./services/sessionService');
const { mainConnection } = require('./services/db');

const apiServer = express();

apiServer.use(cors());

if (!PRODUCTION) {
  /*  display data about requests in console  */
  apiServer.use(morgan('dev'));
  /*  local static for dev purposes   */
  apiServer.use(express.static(path.join(__dirname, '..', 'public', 'assets')));
  apiServer.use('/files', express.static(path.join(__dirname,'public')));
}

apiServer.use(bodyParser.urlencoded({ extended: false }));
apiServer.use(bodyParser.json({}));
apiServer.use(sessionMiddleware);
apiServer.use('/api', mainRouter);

if (!PRODUCTION) {
  /*  use index.html as default index file    */
  apiServer.use('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'assets', 'index.html'));
  });
}

module.exports = {
  apiServer,
};
