const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const {
  HttpError,
} = require('../helpers/http-errors');
const services = require('../services');
const routes = require('../routes');
const buildDb = require('./db');
const buildLogger = require('./logger');

module.exports = async () => {
  const db = await buildDb();

  const app = express();
  const logger = buildLogger();

  // Third-party middlewares
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Routes
  routes.forEach((route) => {
    app.use(route);
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err instanceof HttpError) {
      return res.status(err.httpCode).json(err.getBody());
    }

    return res.status(500).json({
      errorCode: 'INTERNAL_SERVER',
      message: 'Please contact us for further support',
    });
  });

  // App services/business logics
  const ridesService = new services.RidesService(db, logger);
  // const userService = new services.User(models.users);

  Object.assign(app.locals, {
    logger,
    services: {
      rides: ridesService,
    },
  });

  return {
    app,
    db,
    logger,
  };
};
