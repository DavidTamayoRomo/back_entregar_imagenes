const express = require('express');
const morgan = require('morgan');
const requestId = require('express-request-id')();
const bodyParser = require('body-parser');
const logger = require('./config/logger');
const api = require('./api/v1');

// Init App
const app = express();

//cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

//TODO: Definir limite de tamaño de archivos
app.use(express.json({ limit: '50000mb' }));

// Setup middleware
app.use(requestId);
app.use(logger.requests);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));
//parse application/json
app.use(bodyParser.json());

//Setup router and routes
app.use('/api', api);
app.use('/api/v1', api);

// Cuando no encuentra la ruta
// No route found handler
app.use((req, res, next) => {
  next({
    message: 'Route not found',
    statusCode: 404,
    level: 'warn',
  })
});

//Error handler
app.use((err, req, res, next) => {
  const { message, level = 'error' } = err;
  let { statusCode = 500 } = err;
  const log = `${logger.header(req)} ${statusCode} ${message}`;
  logger[level](log);

  //Valdation Errors
  if (err.message.startsWith('ValidationErorr')) {
    statusCode = 422;
  }

  res.status(statusCode);
  res.json({
    error: true,
    statusCode,
    message,
  });
});

module.exports = app;

