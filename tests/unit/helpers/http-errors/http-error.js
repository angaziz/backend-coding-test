const { expect } = require('chai');
const {
  httpErrors: {
    HttpError,
  },
} = require('../../../../src/helpers');

const httpError = new HttpError('ERROR_CODE', 'Error message');

describe('[UNIT] [HELPERS] [HTTP ERRORS] [CLASS] HttpError', () => {
  it('Should return expected error body when requested', () => {
    expect(httpError.getBody()).to.deep.equals({
      errorCode: 'ERROR_CODE',
      message: 'Error message',
    });
  });
});
