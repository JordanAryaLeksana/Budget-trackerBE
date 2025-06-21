const app = require('./app');
const config = require('./config/config');
const serverless = require('serverless-http');
const PORT = config.server.port || 5001;

module.exports = serverless(app)

