const spalatum = require('../../lib');
const superagent = require('../../lib/fragment-request');
const middleware = require('../../lib/express-middleware');

// Mock utils
const templates = require('../../__mocks__/templates.js');
const mockServer = require('../../__mocks__/server.js')('./fragment.js');
const mockRequest = require('../../__mocks__/request');
const mockResponse = require('../../__mocks__/response');

describe('# When calling express middleware', () => {
  const next = jest.fn();
  beforeEach(() => {
    superagent.set = jest.spyOn(superagent, 'set');
    mockServer.listen(8000);
  });

  afterEach(() => {
    mockServer.close();
  });

  it(`Should call the "next" callback function,
    passed as the third argument`, () => {
    middleware(mockRequest, mockResponse, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('Should set headers on the request object', async () => {
    middleware(mockRequest, mockResponse, next);
    await spalatum.render(templates.simple);
    expect(superagent.set).toHaveBeenCalledWith(mockRequest.headers);
  });
});
