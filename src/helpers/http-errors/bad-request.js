const HttpError = require('./http-error');

class BadRequestHttpError extends HttpError {
  constructor(errorCode, message) {
    super(errorCode, message);
    this.httpCode = 400;
  }
}

module.exports = BadRequestHttpError;
