const { spalatumMiddleware } = require('../../lib');

const mockNext = jest.fn();

describe('# When calling express middleware', () => {
  beforeEach(() => {
    spalatumMiddleware({}, {}, mockNext);
  });

  it(`Should call the "next" callback function,
    passed as the third argument`, () => {
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
