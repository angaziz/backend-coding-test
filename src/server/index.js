/* eslint-disable no-console */
const buildApp = require('./app');

const port = 8010;

module.exports = async () => {
  const {
    app,
  } = await buildApp();

  app.listen(port, () => console.log(`App started and listening on port ${port}`));
};
