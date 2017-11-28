const { logRequestFormat } = require('../../lib/logger');

describe('# Testing spalatum request log format', () => {
  it('Calling logRequestFormat with correct request and response object, I expect that returns a expected log object', () => {
    const request = {
      method: 'GET',
      req: {
        path: '/unit/test/',
      },
      host: 'http://localhost/',
    };

    const response = {
      headers: {
        'content-length': '1000',
        'content-type': 'text/html',
        date: 'Tue, 24 Oct 2017 16:55:59 GMT',
      },
      ok: 'true',
      statusCode: '200',
    };

    const expectedLogObject = {
      bytes: '1000',
      'content-type': 'text/html',
      '@timestamp': '2017-10-24T16:55:59.000Z',
      method: 'GET',
      reqok: 'true',
      status: '200',
      urlpath: '/unit/test/',
      vhost: 'http://localhost/',
      log_format: 'morgan',
      apptype: 'fragment',
    };

    const formatedLog = logRequestFormat(request, response);
    expect(formatedLog).toEqual(expectedLogObject);
  });

  it('Calling logRequestFormat with some incorrect data, I expect that returns a expected log object', () => {
    const request = {
      req: {},
    };

    const response = {
      headers: {},
    };

    const expectedLogObject = {
      log_format: 'morgan',
    };

    const formatedLog = logRequestFormat(request, response);
    expect(formatedLog).toEqual(expectedLogObject);
  });

  it('Calling logRequestFormat without request.req or response.headers, I expect that returns false', () => {
    const request = {};
    const response = {};

    const formatedLog = logRequestFormat(request, response);
    expect(formatedLog).toEqual(false);
  });
});
