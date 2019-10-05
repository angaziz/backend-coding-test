const {
  createLogger: CreateLogger,
  format,
  transports,
} = require('winston');

module.exports = () => {
  const logger = new CreateLogger({
    format: format.combine(
      format.timestamp(),
      format.prettyPrint(),
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: `${__dirname}/error.log`, level: 'error' }),
      new transports.File({ filename: `${__dirname}/info.log`, level: 'info' }),
    ],
  });

  if (process.env.NODE_ENV === 'test') {
    logger.transports.forEach((t) => {
      // eslint-disable-next-line no-param-reassign
      t.silent = true;
    });
  }

  return logger;
};
