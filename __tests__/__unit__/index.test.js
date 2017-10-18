const mockdate = require('mockdate');
const originalSuperagent = require('superagent');
const superagentProxy = require('superagent-proxy');
const moment = require('moment');

const spalatum = require('../../lib/index.js');
const ParameterException = require('../../lib/exceptions/parameterException.js');
const PrimaryFragmentException = require('../../lib/exceptions/primaryFragmentException.js');

const responseMock = require('../../__mocks__/response');
const fragmentStr = require('../../__mocks__/fragment.js');

// Templates
const errorTemplate = require('../../__mocks__/error-template.js');
const notFoundTemplate = require('../../__mocks__/notfound-template.js');
const simpleTemplate = require('../../__mocks__/simple-template.js');
const proxyTemplate = require('../../__mocks__/proxy-template.js');
const primaryTemplate = require('../../__mocks__/primary-template.js');
const twoPrimaryTemplate = require('../../__mocks__/two-primary-template.js');
const cacheTemplate = require('../../__mocks__/cache-template.js');
const singleCacheTemplate = require('../../__mocks__/single-cache-template.js');

// Mock Servers
const mockServer = require('../../__mocks__/server.js')('./fragment.js');
const mockProxyServer = require('../../__mocks__/proxy-server.js')('http://localhost:7000');

const originalGet = originalSuperagent.get;
const mockContentType = 'text/html';

beforeEach(() => {
  document.body.outerHTML = null;
  global.superagent = originalSuperagent;
  superagentProxy(global.superagent);
  global.superagent.get = originalGet;
  spalatum.clearAllCache();
  mockdate.reset();
});

describe('# Testing Spalatum configuration', () => {
  it('Calling Spalatum without the template parameter, I expect that returns a exception', () => {
    expect(() => spalatum.render())
      .toThrow(
        new ParameterException('template is mandatory'),
      );
  });
  it('Calling Spalatum with the template parameter different of a string, I expect that returns a exception', () => {
    expect(() => spalatum.render(42))
      .toThrow(
        new ParameterException('template must be a string'),
      );
  });
});

describe('# Testing a template with error in fragment request', async () => {
  it('Calling Spalatum with an generic error in the fragment request, I expect that returns the template with the fragments rendered in blank', async () => {
    document.body.outerHTML = await spalatum.render(errorTemplate);
    expect(document.body.outerHTML).toMatchSnapshot();
  });

  it('Calling Spalatum with a not found error in the fragment request, I expect that returns the template with the fragments rendered in blank', async () => {
    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(404, notFoundTemplate, 'text/html'),
    );

    document.body.outerHTML = await spalatum.render(notFoundTemplate);
    expect(document.body.outerHTML).toMatchSnapshot();
  });

  it('Calling Spalatum with an invalid content type in the fragment request, I expect that returns the template with the fragments rendered in blank', async () => {
    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(200, simpleTemplate, 'application/json'),
    );

    document.body.outerHTML = await spalatum.render(simpleTemplate);
    expect(document.body.outerHTML).toMatchSnapshot();
  });
});

describe('# Testing a template without fragments', async () => {
  it('Calling the lib with the template with no fragments, I expect that returns the same template', async () => {
    const originalTemplate = '<html><head></head><body><h1>Unit test</h1></body></html>';
    document.body.outerHTML = await spalatum.render(originalTemplate);
    expect(document.body.outerHTML).toMatchSnapshot();
  });
});

describe('# Testing a template with fragments using proxy', async () => {
  beforeEach(() => {
    mockProxyServer.listen(5000);
    mockServer.listen(7000);
  });

  it('Calling Spalatum with the template with fragments using proxy, I expect that returns the template with the fragments rendered', async () => {
    document.body.outerHTML = await spalatum.render(proxyTemplate);
    expect(document.body.outerHTML).toMatchSnapshot();
  });

  afterEach(() => {
    mockServer.close();
    mockProxyServer.close();
  });
});

describe('# Testing a template with fragments', async () => {
  it('Calling Spalatum with the template with fragments, I expect that returns the template with the fragments rendered', async () => {
    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(200, fragmentStr, mockContentType),
    );

    document.body.outerHTML = await spalatum.render(simpleTemplate);
    expect(document.body.outerHTML).toMatchSnapshot();
  });
});

describe('# Testing a template with a primary attribute', async () => {
  it('Calling Spalatum with a template with primary attribute, I expect that returns the template with the fragments rendered', async () => {
    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(200, fragmentStr, mockContentType),
    );

    document.body.outerHTML = await spalatum.render(primaryTemplate);
    expect(document.body.outerHTML).toMatchSnapshot();
  });

  it('Calling Spalatum with a template with primary attribute, when the fragment request status code returns 500, I expect that throw an error', async () => {
    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(500, fragmentStr, mockContentType),
    );

    expect(spalatum.render(primaryTemplate)).rejects.toEqual(
      new PrimaryFragmentException(
        'Spalatum can\'t render the primary fragment (http://localhost:8000/), the returned statusCode was 500.',
      ),
    );
  });

  it('Calling Spalatum with a template with primary attribute, when the fragment request status code returns 404, I expect that throw an error', async () => {
    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(404, fragmentStr, mockContentType),
    );

    expect(spalatum.render(primaryTemplate)).rejects.toEqual(
      new PrimaryFragmentException(
        'Spalatum can\'t render the primary fragment (http://localhost:8000/), the returned statusCode was 404.',
      ),
    );
  });

  it('Calling Spalatum with a template with two primary attributes, I excepect that throw an error', async () => {
    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(200, fragmentStr, mockContentType),
    );

    expect(() => spalatum.render(twoPrimaryTemplate))
      .toThrow(
        new PrimaryFragmentException('Must have only one fragment tag as primary'),
      );
  });
});

describe('# Testing a cached request', async () => {
  beforeEach(() => {
    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(200, fragmentStr, mockContentType),
    );
  });

  it('Calling Spalatum with a cached request, I expect that returns the same template without request this fragment again', async () => {
    document.body.outerHTML = await spalatum.render(cacheTemplate);
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

    document.body.outerHTML = await spalatum.render(cacheTemplate);
    expect(document.body.outerHTML).toMatchSnapshot();

    expect(global.superagent.get).toHaveBeenCalledTimes(2);
  });

  it('Calling Spalatum with different templates that share same fragments endpoints, I expect they are stored in the same cache object', async () => {
    await spalatum.render(cacheTemplate);
    await spalatum.render(singleCacheTemplate);

    expect(global.superagent.get).toHaveBeenCalledTimes(2);
  });

  it('Calling Spalatum with a cached but expired request, I expect the fragment is requested again', async () => {
    document.body.outerHTML = await spalatum.render(cacheTemplate);
    expect(document.body.outerHTML).toMatchSnapshot();
    expect(global.superagent.get).toHaveBeenCalledTimes(2);

    const mockedDate = new Date();
    mockedDate.setMinutes(mockedDate.getMinutes() + 11);
    mockdate.set(mockedDate);

    document.body.outerHTML = await spalatum.render(cacheTemplate);
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
