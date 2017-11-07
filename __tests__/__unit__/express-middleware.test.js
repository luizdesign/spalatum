const { spalatum, expressMiddleware } = require('../../lib');
const superagent = require('../../lib/request-client');

// Mock utils
const templates = require('../../__mocks__/templates.js');
const mockServer = require('../../__mocks__/server.js')('./fragment.js');
const mockResponse = require('../../__mocks__/response');

const mockRequest = {
  headers: {
    cookie: 'foo',
  },
};

const next = jest.fn();

describe('# When calling express middleware', () => {
  beforeEach(() => {
    superagent.set = jest.spyOn(superagent, 'set');
    mockServer.listen(8000);
    expressMiddleware(mockRequest, mockResponse, next);
  });

  afterEach(() => {
    mockServer.close();
  });

  it(`Should call the "next" callback function,
    passed as the third argument`, () => {
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('Should set headers on the request object', async () => {
    await spalatum.render(templates.simple);
    expect(superagent.set).toHaveBeenCalledWith(mockRequest.headers);
  });
});
