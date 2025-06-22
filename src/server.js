const app = require('./app');
// const config = require('./config/config');
const serverless = require('@codegenie/serverless-express')

module.exports.handler = serverless({
  app,})
