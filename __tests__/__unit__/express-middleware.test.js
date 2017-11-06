const middleware = require('../../lib/express-middleware');

describe('# When calling express middleware', () => {
  let res;
  let req;
  let next;

  beforeEach(() => {
    res = {};
    req = {};
    next = jest.fn();
  });

  it.only(`Should call the "next" callback function,
    passed as the third argument`, () => {
    middleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
