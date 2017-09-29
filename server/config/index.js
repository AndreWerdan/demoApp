const { NODE_ENV = 'development' } = process.env;
const commonConfig = require('./common');
const prodConfig = require('./production');
const devConfig = require('./development');

let envConfig;
let env;

switch (NODE_ENV) {
  case 'production': {
    envConfig = prodConfig;
    env = 'production';
    break;
  }
  default: {
    envConfig = devConfig;
    env = 'development';
  }
}

const config = Object.assign(commonConfig, envConfig, { ENV: env });

module.exports = config;
