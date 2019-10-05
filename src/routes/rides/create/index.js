const router = require('express').Router();
const bodyParser = require('body-parser');
const handler = require('./handler');

module.exports = router.post('/rides', bodyParser.json(), handler);
