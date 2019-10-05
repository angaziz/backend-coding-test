class HttpError {
  constructor(errorCode, message) {
    this.errorCode = errorCode;
    this.message = message;
  }

  getBody() {
    return {
      errorCode: this.errorCode,
      message: this.message,
    };
  }
}

module.exports = HttpError;
