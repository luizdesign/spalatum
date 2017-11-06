const spalatum = require('../../lib');
// const superagent = require('../../lib/fragment-request');
const middleware = require('../../lib/express-middleware');
// const responseMock = require('../../__mocks__/response');
const templates = require('../../__mocks__/templates.js');

// const mockSet = jest.fn().mockReturnThis();

// const mockGet = (status, result, type) => {
//   const mock = responseMock(status, result, type);
//   mock.set = mockSet;
//   mock.use = superagent.use;

//   superagent.get = jest.fn().mockReturnValue(mock);
// };

describe('# When calling express middleware', () => {
  let res;
  let req;
  let next;

  beforeEach(() => {
    res = {};
    req = {
      headers: {
        cookie: 'foo',
      },
    };
    next = jest.fn();
  });

  it(`Should call the "next" callback function,
    passed as the third argument`, () => {
    middleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it.skip('Should receive headers on the request object', async () => {
    // mockGet(200, templates.simple, 'text/html');
    const result = middleware(req, res, next);
    await spalatum.render(templates.simple);
    expect(result).toHaveBeenCalledWith(req.headers);
  });
});
