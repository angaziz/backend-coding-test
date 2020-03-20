const { expect } = require('chai');
const {
  httpErrors: {
    BadRequestHttpError,
  },
} = require('../../../../src/helpers');

const badRequestHttpError = new BadRequestHttpError('ERROR_CODE', 'Error message');

describe('[UNIT] [HELPERS] [HTTP ERRORS] [CLASS] BadRequestHttpError', () => {
  it('Should have "400" http code', () => {
    expect(badRequestHttpError.httpCode).to.equals(false);
  });

  it('Should return expected error body when requested', () => {
    expect(badRequestHttpError.getBody()).to.deep.equals({
      errorCode: 'ERROR_CODE',
      message: 'Error message',
    });
  });
});
