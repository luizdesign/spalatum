const { spalatumMiddleware } = require('../../lib');
const responseMock = require('../../__mocks__/response');

const mockNext = jest.fn();

describe('# When calling express middleware', () => {
  beforeEach(() => {
    spalatumMiddleware({}, responseMock(), mockNext);
  });

  it(`Should call the "next" callback function,
    passed as the third argument`, () => {
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
