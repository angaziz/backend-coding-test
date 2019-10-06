const { expect } = require('chai');
const {
  httpErrors: {
    NotFoundHttpError,
  },
} = require('../../../../src/helpers');

const notFoundHttpError = new NotFoundHttpError('ERROR_CODE', 'Error message');

describe('[UNIT] [HELPERS] [HTTP ERRORS] [CLASS] NotFoundHttpError', () => {
  it('Should have "404" http code', () => {
    expect(notFoundHttpError.httpCode).to.equals(404);
  });

  it('Should return expected error body when requested', () => {
    expect(notFoundHttpError.getBody()).to.deep.equals({
      errorCode: 'ERROR_CODE',
      message: 'Error message',
    });
  });
});
