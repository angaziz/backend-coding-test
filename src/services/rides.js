
const {
  BadRequestHttpError,
  NotFoundHttpError,
} = require('../helpers/http-errors'); // adopting lodash style, allowing us to directly load the specific dir, but also able to load the parent for more

class RidesService {
  constructor(db, logger) {
    this.db = db;
    this.logger = logger;
  }

  /**
   * Validate whether the coordinate is correct
   *
   * @param {number} lat
   * @param {number} long
   * @returns {boolean}
   */
  isValidCoordinate(lat, long) {
    return (
      lat < -90 || lat > 90 || long < -180 || long > 180
    );
  }

  /**
   * Validate whether the input is a valid string
   *
   * @param {string} str
   * @returns {boolean}
   */
  isValidString(str) {
    return (typeof str !== 'string' || str.length < 1);
  }

  /**
   * Ride payload
   * @typedef {Object} RidePayload
   * @property {number} startLat - Ride start latitude
   * @property {number} startLong - Ride start longitude
   * @property {number} endLong - Ride end latitude
   * @property {number} endLong - Ride end longitude
   * @property {string} riderName - Rider name
   * @property {string} driverName - Driver name
   * @property {string} driverVehicle - Driver vehicle
   */

  /**
   * Validate whether the payload is valid
   *
   * @param {RidePayload} payload
   * @returns {void}
   */
  isValidPayload(payload) {
    if (this.isValidCoordinate(payload.startLat, payload.startLong)) {
      throw new BadRequestHttpError(
        'VALIDATION_ERROR',
        'Start latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
      );
    }


    if (this.isValidCoordinate(payload.endLat, payload.endLong)) {
      throw new BadRequestHttpError(
        'VALIDATION_ERROR',
        'End latitude and longitude must be between -90 to 90 and -180 to 180 degrees respectively',
      );
    }

    if (this.isValidString(payload.riderName)) {
      throw new BadRequestHttpError(
        'VALIDATION_ERROR',
        'Rider name must be a non empty string',
      );
    }

    if (this.isValidString(payload.driverName)) {
      throw new BadRequestHttpError(
        'VALIDATION_ERROR',
        'Driver name must be a non empty string',
      );
    }

    if (this.isValidString(payload.driverVehicle)) {
      throw new BadRequestHttpError(
        'VALIDATION_ERROR',
        'Driver vehicle must be a non empty string',
      );
    }
  }

  /**
   * Create new ride
   *
   * @param {RidePayload} payload
   * @returns {Promise} Promise object of the inserted ride
   */
  async create(payload) {
    try {
      this.logger.info(`Creating ride of ${payload.riderName} with ${payload.driverName} using ${payload.driverVehicle}`);
      this.isValidPayload(payload);

      const values = [
        payload.startLat,
        payload.startLong,
        payload.endLat,
        payload.endLong,
        payload.riderName,
        payload.driverName,
        payload.driverVehicle,
      ];

      const lastInsertRowId = await this.db
        .prepare('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(values)
        .lastInsertRowid;

      const createdRide = this.db.prepare('SELECT * FROM rides where rideId = ?').get(lastInsertRowId);

      return createdRide;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  /**
   * Get list of rides
   *
   * @returns {Promise} Promise array of ride objects
   */
  async getList() {
    try {
      this.logger.info('Listing created rides');
      const rides = await this.db.prepare('SELECT * FROM Rides').all();

      if (rides.length === 0) {
        throw new NotFoundHttpError(
          'RIDES_NOT_FOUND_ERROR',
          'Could not find any rides',
        );
      }

      return rides;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  /**
   * Get ride by ID
   *
   * @param {number} id
   * @returns {Promise} Promise object of ride
   */
  async getById(rideID) {
    try {
      this.logger.info(`Get ride detail of ${rideID}`);
      const ride = await this.db.prepare('SELECT * FROM Rides WHERE rideID = ?').get(rideID);

      if (!ride) {
        throw new NotFoundHttpError(
          'RIDES_NOT_FOUND_ERROR',
          'Could not find any rides',
        );
      }

      return ride;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }
}

module.exports = RidesService;
