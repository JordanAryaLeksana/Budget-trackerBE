const express = require('express');
const app = express();
const routes = require('./routes');
const { enableCORS, setSecurityHeaders } = require('./middlewares/security.middleware');
require('./store/sequelize');
const errorHandler = require('./middlewares/ErrorHandler.middleware');

app.use(express.json());
app.use(enableCORS);
app.use(setSecurityHeaders);
app.use('/api/v1', routes);
app.use(errorHandler)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Terjadi kesalahan pada server',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

module.exports = app;
