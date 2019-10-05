/* eslint-disable no-console */
const buildApp = require('./app');

const port = 8010;

module.exports = async () => {
  const {
    app,
    logger,
  } = await buildApp();

  app.listen(port, () => logger.info(`App started and listening on port ${port}`));
};
