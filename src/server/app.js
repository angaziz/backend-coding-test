const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const {
  HttpError,
} = require('../helpers/http-errors'); // adopting lodash style, allowing us to directly load the specific dir, but also able to load the parent for more
const services = require('../services');
const routes = require('../routes');
const dbLoader = require('./db');
const initLogger = require('./logger');

module.exports = async () => {
  const db = await dbLoader();

  const app = express();
  const logger = initLogger();

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
