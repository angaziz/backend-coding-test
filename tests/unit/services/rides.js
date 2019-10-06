const { expect } = require('chai');
const sinon = require('sinon');
const {
  RidesService,
} = require('../../../src/services');
const {
  BadRequestHttpError,
  NotFoundHttpError,
} = require('../../../src/helpers/http-errors');
const ridesFixture = require('../../fixtures/rides');

// Setting up
const sandbox = sinon.createSandbox();
const dbMock = {
  prepare: sandbox.stub().returnsThis(),
  all: sandbox.stub(),
  get: sandbox.stub(),
  run: sandbox.stub(),
};
const loggerMock = {
  info: sandbox.stub(),
  error: sandbox.stub(),
};
const ridesService = new RidesService(dbMock, loggerMock);

describe('[UNIT] [SERVICES] [CLASS] RidesService', () => {
  beforeEach(() => {
    loggerMock.info.resetHistory();
    loggerMock.error.resetHistory();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getList', () => {
    describe('Fail', () => {
      it('Should log the error when rejected', async () => {
        dbMock.all.resolves([]);

        try {
          await ridesService.getList(0, 10);
        } catch (error) {
          expect(loggerMock.error.calledOnce).to.be.true;
        }
      });

      it('Should be rejected with not found error when data is not available', async () => {
        dbMock.all.resolves([]);

        try {
          await ridesService.getList(0, 10);
        } catch (error) {
          expect(error).to.be.instanceOf(NotFoundHttpError);
        }
      });
    });

    describe('Success', () => {
      it('Should log the info when executed', async () => {
        dbMock.all.resolves(ridesFixture);

        await ridesService.getList(0, 3);

        expect(loggerMock.info.calledOnce).to.be.true;
      });

      it('Should set offset=0 and limit=10 when is not provided', async () => {
        dbMock.all.resetHistory();
        dbMock.all.resolves(ridesFixture);

        await ridesService.getList();

        expect(dbMock.all.withArgs([10, 0]).calledOnce).to.be.true;
      });

      it('Should return ride list when the data is exist', async () => {
        dbMock.all.resolves(ridesFixture);

        const rides = await ridesService.getList(0, 3);

        expect(rides.length).to.equals(3);
      });
    });

    describe('Security', () => {
      beforeEach(() => {
        dbMock.all.resetHistory();
      });

      it('Should set offset=0 when offset is injected with malicious characters', async () => {
        dbMock.all.resolves(ridesFixture);

        await ridesService.getList("5'", 10);

        expect(dbMock.all.withArgs([10, 0]).calledOnce).to.be.true;
      });

      it('Should set limit=10 when limit is injected with malicious characters', async () => {
        dbMock.all.resolves(ridesFixture);

        await ridesService.getList(0, "20'");

        expect(dbMock.all.withArgs([10, 0]).calledOnce).to.be.true;
      });
    });
  });

  describe('getById', () => {
    describe('Fail', () => {
      it('Should log the error when rejected', async () => {
        dbMock.get.resolves(undefined);

        try {
          await ridesService.getById(123);
        } catch (error) {
          expect(loggerMock.error.calledOnce).to.be.true;
        }
      });

      it('Should be rejected with not found error when ride is not exist', async () => {
        dbMock.get.resolves(undefined);

        try {
          await ridesService.getById(123);
        } catch (error) {
          expect(error).to.be.instanceOf(NotFoundHttpError);
        }
      });
    });

    describe('Success', () => {
      it('Should log the info when executed', async () => {
        dbMock.get.resolves(ridesFixture[0]);

        await ridesService.getById(123);

        expect(loggerMock.info.calledOnce).to.be.true;
      });

      it('Should return ride detail when the ride is exist', async () => {
        dbMock.get.resolves(ridesFixture[0]);

        const ride = await ridesService.getById(123);

        expect(ride).to.deep.equals(ridesFixture[0]);
      });
    });
  });

  describe('create', () => {
    describe('Fail', () => {
      const startCoordinateErrorMessage = 'Start latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively';
      const endCoordinateErrorMessage = 'End latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively';
      const riderNameErrorMessage = 'Rider name must be a non empty string';
      const driverNameErrorMessage = 'Driver name must be a non empty string';
      const driverVehicleErrorMessage = 'Driver vehicle must be a non empty string';

      it('Should be rejected with validation error when startLat is invalid', async () => {
        try {
          await ridesService.create({
            ...ridesFixture[0],
            startLat: 200,
          });
        } catch (error) {
          expect(error).to.be.instanceOf(BadRequestHttpError);
          expect(error.message).to.be.equals(startCoordinateErrorMessage);
        }
      });

      it('Should be rejected with validation error when startLong is invalid', async () => {
        try {
          await ridesService.create({
            ...ridesFixture[0],
            startLong: 200,
          });
        } catch (error) {
          expect(error).to.be.instanceOf(BadRequestHttpError);
          expect(error.message).to.be.equals(startCoordinateErrorMessage);
        }
      });

      it('Should be rejected with validation error when endLat is invalid', async () => {
        try {
          await ridesService.create({
            ...ridesFixture[0],
            endLat: 200,
          });
        } catch (error) {
          expect(error).to.be.instanceOf(BadRequestHttpError);
          expect(error.message).to.be.equals(endCoordinateErrorMessage);
        }
      });

      it('Should be rejected with validation error when endLong is invalid', async () => {
        try {
          await ridesService.create({
            ...ridesFixture[0],
            endLong: 200,
          });
        } catch (error) {
          expect(error).to.be.instanceOf(BadRequestHttpError);
          expect(error.message).to.be.equals(endCoordinateErrorMessage);
        }
      });

      it('Should be rejected with validation error when riderName is invalid string', async () => {
        try {
          await ridesService.create({
            ...ridesFixture[0],
            riderName: null,
          });
        } catch (error) {
          expect(error).to.be.instanceOf(BadRequestHttpError);
          expect(error.message).to.be.equals(riderNameErrorMessage);
        }
      });

      it('Should be rejected with validation error when driverName is invalid string', async () => {
        try {
          await ridesService.create({
            ...ridesFixture[0],
            driverName: null,
          });
        } catch (error) {
          expect(error).to.be.instanceOf(BadRequestHttpError);
          expect(error.message).to.be.equals(driverNameErrorMessage);
        }
      });

      it('Should be rejected with validation error when driverVehicle is invalid string', async () => {
        try {
          await ridesService.create({
            ...ridesFixture[0],
            driverVehicle: null,
          });
        } catch (error) {
          expect(error).to.be.instanceOf(BadRequestHttpError);
          expect(error.message).to.be.equals(driverVehicleErrorMessage);
        }
      });

      it('Should log the error when rejected', async () => {
        try {
          await ridesService.create({
            ...ridesFixture[0],
            driverVehicle: null,
          });
        } catch (error) {
          expect(loggerMock.error.calledOnce).to.be.true;
        }
      });
    });

    describe('Success', () => {
      beforeEach(() => {
        dbMock.run.resetHistory();
        dbMock.get.resetHistory();
      });

      it('Should log the info when executed', async () => {
        dbMock.run.resolves({
          lastInsertRowId: 123,
        });

        await ridesService.create(ridesFixture[0]);

        expect(loggerMock.info.calledOnce).to.be.true;
      });

      it('Should create new ride when the payload is valid', async () => {
        dbMock.run.resolves({
          lastInsertRowId: 123,
        });

        const ride = await ridesService.create(ridesFixture[0]);

        expect(dbMock.run.calledOnce).to.be.true;
        expect(dbMock.get.calledOnce).to.be.true;
        expect(ride).to.be.deep.equals(ridesFixture[0]);
      });
    });
  });
});
