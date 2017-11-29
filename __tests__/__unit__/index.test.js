// External dependencies
const http = require('http');
const mockdate = require('mockdate');
const originalSuperagent = require('../../lib/request-client');
const moment = require('moment');

// Lib components
const { spalatum, spalatumMiddleware } = require('../../lib');
const ParameterException = require('../../lib/exceptions/parameterException.js');
const PrimaryFragmentException = require('../../lib/exceptions/primaryFragmentException.js');

// Mock utils
const responseMock = require('../../__mocks__/response');
const fragmentStr = require('../../__mocks__/fragment.js');
const templates = require('../../__mocks__/templates.js');
const fragment = require('../../__mocks__/fragment');
const mockFragmentServer = require('../../__mocks__/server.js')('./fragment.js');
const mockProxyServer = require('../../__mocks__/proxy-server.js')('http://localhost:7000');

const originalGet = originalSuperagent.get;
const mockContentType = 'text/html';
const mockSet = jest.fn().mockReturnThis();

const mockGet = (status, result, type) => {
  const mock = responseMock(status, result, type);
  mock.set = mockSet;

  global.superagent.get = jest.fn().mockReturnValue(mock);
};

const serverCb = jest.fn((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(fragment);
  res.end();
});

beforeEach(() => {
  // Clear testing data
  document.body.outerHTML = null;
  spalatum.clearAllCache();
  mockdate.reset();

  // Reseting superagent
  global.superagent = originalSuperagent;
  global.superagent.get = originalGet;
});

describe('# Testing Spalatum configuration', () => {
  it('Calling Spalatum without the template parameter, I expect that returns a exception', () => {
    expect(() => spalatum.render()).toThrow(
      new ParameterException('template is mandatory'),
    );
  });
  it('Calling Spalatum with the template parameter different of a string, I expect that returns a exception', () => {
    expect(() => spalatum.render(42)).toThrow(
      new ParameterException('template must be a string'),
    );
  });
});

describe('# Testing a template with error in fragment request', async () => {
  it('Calling Spalatum with an generic error in the fragment request, I expect that returns the template with the fragments rendered in blank', async () => {
    document.body.outerHTML = await spalatum.render(templates.error);
    expect(document.body.outerHTML).toMatchSnapshot();
  });

  it('Calling Spalatum with a not found error in the fragment request, I expect that returns the template with the fragments rendered in blank', async () => {
    mockGet(404, templates.notFound, 'text/html');
    document.body.outerHTML = await spalatum.render(templates.notFound);
    expect(document.body.outerHTML).toMatchSnapshot();
  });

  it('Calling Spalatum with an invalid content type in the fragment request, I expect that returns the template with the fragments rendered in blank', async () => {
    mockGet(200, templates.simple, 'application/json');
    document.body.outerHTML = await spalatum.render(templates.simple);
    expect(document.body.outerHTML).toMatchSnapshot();
  });
});

describe('# Testing a template without fragments', async () => {
  it('Calling the lib with the template with no fragments, I expect that returns the same template', async () => {
    document.body.outerHTML = await spalatum.render(templates.clean);
    expect(document.body.outerHTML).toMatchSnapshot();
  });
});

describe('# Testing a template with fragments using proxy', async () => {
  beforeEach(() => {
    mockProxyServer.listen(5000);
    mockFragmentServer.listen(7000);
  });

  it('Calling Spalatum with the template with fragments using proxy, I expect that returns the template with the fragments rendered', async () => {
    document.body.outerHTML = await spalatum.render(templates.proxy);
    expect(document.body.outerHTML).toMatchSnapshot();
  });

  afterEach(() => {
    mockFragmentServer.close();
    mockProxyServer.close();
  });
});

describe('# Testing a template with fragments', () => {
  it('Calling Spalatum with the template with fragments, I expect that returns the template with the fragments rendered and an specific header with the package name is set', async () => {
    mockGet(200, fragmentStr, mockContentType);
    document.body.outerHTML = await spalatum.render(templates.simple);
    expect(document.body.outerHTML).toMatchSnapshot();
    expect(mockSet).toHaveBeenCalledWith('user-agent', process.env.npm_package_name);
  });

  it('Calling Spalatum with a template with fragments, I expect that returns a template with fragments rendered and the header "Host" setted with the fragment hostname', async () => {
    mockGet(200, fragmentStr, mockContentType);
    document.body.outerHTML = await spalatum.render(templates.https);
    expect(document.body.outerHTML).toMatchSnapshot();
    expect(mockSet).toHaveBeenCalledWith('host', 'httpbin.org');
  });

  it('Calling Spalatum with a template with fragments, I expect that the destination server recieve the header "Host" setted with the fragment hostname', async () => {
    const server = http.createServer(serverCb);
    server.listen(8000);
    global.superagent.set = jest.fn(global.superagent.set);
    await spalatum.render(templates.simple);

    expect(serverCb).toHaveBeenCalledWith(expect.objectContaining({
      headers: expect.objectContaining({
        host: 'localhost',
      }),
    }), expect.anything());

    server.close();
  });
});

describe('# Testing a template with a primary attribute', async () => {
  it('Calling Spalatum with a template with primary attribute, I expect that returns the template with the fragments rendered', async () => {
    mockGet(200, fragmentStr, mockContentType);
    document.body.outerHTML = await spalatum.render(templates.primary);
    expect(document.body.outerHTML).toMatchSnapshot();
  });

  it('Calling Spalatum with a template with primary attribute, when the fragment request status code returns 500, I expect that throw an error', async () => {
    mockGet(500, fragmentStr, mockContentType);
    expect(spalatum.render(templates.primary)).rejects.toEqual(
      new PrimaryFragmentException(
        'Spalatum can\'t render the primary fragment (http://localhost:8000/), the returned statusCode was 500.',
      ),
    );
  });

  it('Calling Spalatum with a template with primary attribute, when the fragment request status code returns 404, I expect that throw an error', async () => {
    mockGet(404, fragmentStr, mockContentType);
    expect(spalatum.render(templates.primary)).rejects.toEqual(
      new PrimaryFragmentException(
        'Spalatum can\'t render the primary fragment (http://localhost:8000/), the returned statusCode was 404.',
      ),
    );
  });

  it('Calling Spalatum with a template with two primary attributes, I excepect that throw an error', async () => {
    mockGet(200, fragmentStr, mockContentType);
    expect(() => spalatum.render(templates.twoPrimary))
      .toThrow(
        new PrimaryFragmentException('Must have only one fragment tag as primary'),
      );
  });
});

describe('# Testing a cached request', async () => {
  beforeEach(() => {
    mockGet(200, fragmentStr, mockContentType);
  });

  it('Calling Spalatum with a cached request, I expect that returns the same template without request this fragment again', async () => {
    document.body.outerHTML = await spalatum.render(templates.cache);
    expect(document.body.outerHTML).toMatchSnapshot();
    expect(Object.keys(spalatum.getCache()).length).toEqual(2);

    expect(spalatum.getCache()[Object.keys(spalatum.getCache())[0]])
      .toEqual(expect.objectContaining({
        content: expect.any(String),
        timestamp: expect.any(String),
      }));

    expect(global.superagent.get).toHaveBeenCalledTimes(2);

    const mockedDate = new Date();
    mockedDate.setMinutes(mockedDate.getMinutes() + 5);
    mockdate.set(mockedDate);

    document.body.outerHTML = await spalatum.render(templates.cache);
    expect(document.body.outerHTML).toMatchSnapshot();

    expect(global.superagent.get).toHaveBeenCalledTimes(2);
  });

  it('Calling Spalatum with different templates that share same fragments endpoints, I expect they are stored in the same cache object', async () => {
    await spalatum.render(templates.cache);
    await spalatum.render(templates.singleCache);

    expect(global.superagent.get).toHaveBeenCalledTimes(2);
  });

  it('Calling Spalatum with a cached but expired request, I expect the fragment is requested again', async () => {
    document.body.outerHTML = await spalatum.render(templates.cache);
    expect(document.body.outerHTML).toMatchSnapshot();
    expect(global.superagent.get).toHaveBeenCalledTimes(2);

    const mockedDate = new Date();
    mockedDate.setMinutes(mockedDate.getMinutes() + 11);
    mockdate.set(mockedDate);

    document.body.outerHTML = await spalatum.render(templates.cache);
    expect(document.body.outerHTML).toMatchSnapshot();

    expect(global.superagent.get).toHaveBeenCalledTimes(4);
  });
});

describe('# Testing cache methods', () => {
  const endpoints = [
    'http://localhost:9000/',
    'http://localhost:9001/',
  ];

  const cacheItem = {
    content: 'blablabla',
    timestamp: moment().format(),
  };

  beforeEach(() => {
    const cache = spalatum.getCache();

    endpoints.forEach((item) => {
      cache[item] = cacheItem;
    });
  });

  it('Calling Spalatum removeCacheByEndpoint method, I expect to remove a specific cache item by endpoint', () => {
    expect(spalatum.clearCacheItem(endpoints[0])).toBe(true);
    expect(Object.keys(spalatum.getCache()).length).toBe(1);
    expect(spalatum.clearCacheItem(endpoints[0])).toBe(false);
    expect(Object.keys(spalatum.getCache())[0]).toBe(endpoints[1]);
  });

  it('Calling Spalatum removeAllCache method, I expect an empty cache', () => {
    expect(spalatum.clearAllCache()).toEqual({});
    expect(spalatum.getCache()).toEqual({});
  });
});

describe('# Testing the middleware', () => {
  const server = http.createServer(serverCb);
  const mockRequest = { headers: { cookie: 'foo' } };

  beforeEach(async () => {
    server.listen(8000);
    global.superagent.set = jest.fn(global.superagent.set);
    spalatumMiddleware(mockRequest, responseMock(), jest.fn());
    await spalatum.render(templates.simple);
  });

  afterEach(() => server.close());

  it('Should set headers on the request object', async () => {
    expect(global.superagent.set).toHaveBeenCalledWith(mockRequest.headers);
  });

  it(`Calling Spalatum within the middleware,
    I expect that correct headers are passed to destination server`, () => {
    expect(serverCb).toHaveBeenCalledWith(expect.objectContaining({
      headers: expect.objectContaining({
        cookie: mockRequest.headers.cookie,
      }),
    }), expect.anything());
  });
});