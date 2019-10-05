const HttpError = require('./http-error');

class NotFoundHttpError extends HttpError {
  constructor(errorCode, message) {
    super(errorCode, message);
    this.httpCode = 404;
  }
}

module.exports = NotFoundHttpError;
