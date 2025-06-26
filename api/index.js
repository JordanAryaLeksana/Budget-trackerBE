const app = require('../src/app');
const serverless = require('@codegenie/serverless-express');

module.exports = serverless.configure({ app });
