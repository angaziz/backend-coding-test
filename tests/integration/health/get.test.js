const request = require('supertest');
const buildApp = require('../../../src/server/app');

describe('[INTEGRATION] [HEALTH] [GET] - /health', () => {
  let app;

  before(async () => {
    ({ app } = await buildApp());
  });

  it('Should return health', (done) => {
    request(app)
      .get('/health')
      .expect('Content-Type', /application\/json/)
      .expect(200, done);
  });
});
