const health = require('./health');
const rides = require('./rides');

module.exports = [
  ...health,
  ...rides,
];
