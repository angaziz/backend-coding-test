const {
  expect,
} = require('chai');
const request = require('supertest');
const buildApp = require('../../../src/server/app');
const {
  BadRequestHttpError,
} = require('../../../src/helpers/http-errors');

describe('[INTEGRATION] [RIDES] [POST] - /rides', () => {
  let app;
  const payload = {
    startLat: -6.21873,
    startLong: 106.82376,
    endLat: -6.229807,
    endLong: 106.827727,
    riderName: 'Anggie Aziz',
    driverName: 'Yusuf Triwanto',
    driverVehicle: 'Ducati Multistrada 1260',
  };

  before(async () => {
    ({ app } = await buildApp());
  });

  describe('Fail', () => {
    it('Should return validation error when startLat is invalid', () => {
      const expectedErrorResponse = new BadRequestHttpError(
        'VALIDATION_ERROR',
        'Start latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
      );

      return request(app)
        .post('/rides')
        .send({
          ...payload,
          startLat: 200,
        })
        .expect('Content-Type', /application\/json/)
        .expect(400, expectedErrorResponse.getBody());
    });

    it('Should return validation error when startLong is invalid', () => {
      const expectedErrorResponse = new BadRequestHttpError(
        'VALIDATION_ERROR',
        'Start latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
      );

      return request(app)
        .post('/rides')
        .send({
          ...payload,
          startLong: 200,
        })
        .expect('Content-Type', /application\/json/)
        .expect(400, expectedErrorResponse.getBody());
    });
    it('Should return validation error when endLat is invalid', () => {
      const expectedErrorResponse = new BadRequestHttpError(
        'VALIDATION_ERROR',
        'End latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
      );

      return request(app)
        .post('/rides')
        .send({
          ...payload,
          endLat: 200,
        })
        .expect('Content-Type', /application\/json/)
        .expect(400, expectedErrorResponse.getBody());
    });

    it('Should return validation error when endLong is invalid', () => {
      const expectedErrorResponse = new BadRequestHttpError(
        'VALIDATION_ERROR',
        'End latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
      );

      return request(app)
        .post('/rides')
        .send({
          ...payload,
          endLong: 200,
        })
        .expect('Content-Type', /application\/json/)
        .expect(400, expectedErrorResponse.getBody());
    });

    it('Should return validation error when endLong is invalid', () => {
      const expectedErrorResponse = new BadRequestHttpError(
        'VALIDATION_ERROR',
        'End latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
      );

      return request(app)
        .post('/rides')
        .send({
          ...payload,
          endLong: 200,
        })
        .expect('Content-Type', /application\/json/)
        .expect(400, expectedErrorResponse.getBody());
    });

    it('Should return validation error when riderName is invalid string', () => {
      const expectedErrorResponse = new BadRequestHttpError(
        'VALIDATION_ERROR',
        'Rider name must be a non empty string',
      );

      return request(app)
        .post('/rides')
        .send({
          ...payload,
          riderName: null,
        })
        .expect('Content-Type', /application\/json/)
        .expect(400, expectedErrorResponse.getBody());
    });

    it('Should return validation error when driverName is invalid string', () => {
      const expectedErrorResponse = new BadRequestHttpError(
        'VALIDATION_ERROR',
        'Driver name must be a non empty string',
      );

      return request(app)
        .post('/rides')
        .send({
          ...payload,
          driverName: '',
        })
        .expect('Content-Type', /application\/json/)
        .expect(400, expectedErrorResponse.getBody());
    });

    it('Should return validation error when driverVehicle is invalid string', () => {
      const expectedErrorResponse = new BadRequestHttpError(
        'VALIDATION_ERROR',
        'Driver vehicle must be a non empty string',
      );

      return request(app)
        .post('/rides')
        .send({
          ...payload,
          driverVehicle: '',
        })
        .expect('Content-Type', /application\/json/)
        .expect(400, expectedErrorResponse.getBody());
    });
  });

  describe('Success', () => {
    it('Should return success response when request is valid', () => request(app)
      .post('/rides')
      .send(payload)
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .expect((res) => {
        expect(res.body).includes(payload);
      }));
  });
});
