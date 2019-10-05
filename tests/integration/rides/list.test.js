const {
  expect,
} = require('chai');
const request = require('supertest');
const buildApp = require('../../../src/server/app');
const {
  RidesService,
} = require('../../../src/services');
const ridesFixture = require('../../fixtures/rides');
const {
  NotFoundHttpError,
} = require('../../../src/helpers/http-errors');

describe('[INTEGRATION] [RIDES] [GET] - /rides', () => {
  let app;
  let db;

  before(async () => {
    ({ app, db } = await buildApp());
  });

  describe('Fail', () => {
    it('Should return not found error when there is no ride exist', () => {
      const expectedErrorResponse = new NotFoundHttpError(
        'RIDES_NOT_FOUND_ERROR',
        'Could not find any rides'
      );

      return request(app)
        .get('/rides')
        .expect('Content-Type', /application\/json/)
        .expect(404, expectedErrorResponse.getBody());
    });
  });

  describe('Success', () => {
    before(async () => {
      // Preparing data for success case
      const rideService = new RidesService(db, {});
      for (let i = 0; i < ridesFixture.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await rideService.create(ridesFixture[i]);
      }
    });

    it('Should return list of rides when the data is exist', () => {
      return request(app)
        .get('/rides')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect((res) => {
          expect(res.body.length, 3);
        });
    });
  });
});
