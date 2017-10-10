const mockdate = require('mockdate');
const originalSuperagent = require('superagent');
const superagentProxy = require('superagent-proxy');
const moment = require('moment');

const mockPath = '../../__mocks__';
const libPath = '../../lib';

const Spalatum = require(`${libPath}/index.js`);
const ParameterException = require(`${libPath}/exceptions/parameterException.js`);
const PrimaryFragmentException = require(`${libPath}/exceptions/primaryFragmentException.js`);
const responseMock = require(`${mockPath}/response`);

const originalGet = originalSuperagent.get;
const mockContentType = 'text/html';

beforeEach(() => {
  document.body.outerHTML = null;
  global.superagent = originalSuperagent;
  superagentProxy(global.superagent);
  global.superagent.get = originalGet;
  cache = {};
  mockdate.reset();
});

describe('# Testing Spalatum configuration', () => {
  it('Calling Spalatum without the template parameter, I expect that returns a exception', () => {
    expect(() => new Spalatum().render())
      .toThrow(
        new ParameterException('template is mandatory')
      );
  });
  it('Calling Spalatum with the template parameter different of a string, I expect that returns a exception', () => {
    expect(() => new Spalatum(42).render())
      .toThrow(
        new ParameterException('template must be a string')
      );
  });
});

describe('# Testing a template with error in fragment request', async () => {
  it('Calling Spalatum with an generic error in the fragment request, I expect that returns the template with the fragments rendered in blank', async () => {
    const genericErrorTemplate = require(`${mockPath}/error-template.js`);
    const renderedGenericErrorTemplate = await new Spalatum(genericErrorTemplate, {}).render();
    document.body.outerHTML = renderedGenericErrorTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
  });

  it('Calling Spalatum with a not found error in the fragment request, I expect that returns the template with the fragments rendered in blank', async () => {
    const notFoundErrorTemplate = require(`${mockPath}/notfound-template.js`);
    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(404, notFoundErrorTemplate, 'text/html')
    );
    const renderedNotFoundErrorTemplate = await new Spalatum(notFoundErrorTemplate).render();
    document.body.outerHTML = renderedNotFoundErrorTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
  });

  it('Calling Spalatum with an invalid content type in the fragment request, I expect that returns the template with the fragments rendered in blank', async () => {
    const simpleTemplate = require(`${mockPath}/simple-template.js`);
    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(200, simpleTemplate, 'application/json')
    );

    const renderedSimpleTemplate = await new Spalatum(simpleTemplate).render();
    document.body.outerHTML = renderedSimpleTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
  });
});

describe('# Testing a template without fragments', async () => {
  it('Calling the lib with the template with no fragments, I expect that returns the same template', async () => {
    const originalTemplate = '<html><head></head><body><h1>Unit test</h1></body></html>';
    const renderedTemplate = await new Spalatum(originalTemplate).render();
    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
  });
});

describe('# Testing a template with fragments using proxy', async () => {
  it('Calling Spalatum with the template with fragments using proxy, I expect that returns the template with the fragments rendered', async () => {
    const originalTemplate = require(`${mockPath}/proxy-template.js`);
    const mockServer = require(`${mockPath}/server.js`)('./fragment.js');
    const mockProxyServer = require(`${mockPath}/proxy-server.js`)('http://localhost:7000');
    mockProxyServer.listen(5000);
    mockServer.listen(7000);

    const renderedTemplate = await new Spalatum(originalTemplate).render();
    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
    mockServer.close();
    mockProxyServer.close();
  });
});

describe('# Testing a template with fragments', async () => {
  it('Calling Spalatum with the template with fragments, I expect that returns the template with the fragments rendered', async () => {
    const originalTemplate = require(`${mockPath}/simple-template.js`);
    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(200, require(`${mockPath}/fragment.js`), mockContentType)
    );

    const renderedTemplate = await new Spalatum(originalTemplate).render();
    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
  });
});

describe('# Testing a template with a primary attribute', async () => {
  it('Calling Spalatum with a template with primary attribute, I expect that returns the template with the fragments rendered', async () => {
    const primaryTemplate = require(`${mockPath}/primary-template.js`);
    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(200, require(`${mockPath}/fragment.js`), mockContentType)
    );

    const renderedTemplate = await new Spalatum(primaryTemplate).render();
    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
  });

  it('Calling Spalatum with a template with primary attribute, when the fragment request status code returns 500, I expect that throw an error', async () => {
    const primaryTemplate = require(`${mockPath}/primary-template.js`);
    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(500, require(`${mockPath}/fragment.js`), mockContentType)
    );

    expect(new Spalatum(primaryTemplate).render()).rejects.toEqual(
      new PrimaryFragmentException(
        'Spalatum can\'t render the primary fragment (http://localhost:8000/), the returned statusCode was 500.',
      ),
    );
  });

  it('Calling Spalatum with a template with primary attribute, when the fragment request status code returns 404, I expect that throw an error', async () => {
    const primaryTemplate = require(`${mockPath}/primary-template.js`);
    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(404, require(`${mockPath}/fragment.js`), mockContentType)
    );

    expect(new Spalatum(primaryTemplate).render()).rejects.toEqual(
      new PrimaryFragmentException(
        'Spalatum can\'t render the primary fragment (http://localhost:8000/), the returned statusCode was 404.',
      ),
    );
  });

  it('Calling Spalatum with a template with two primary attributes, I excepect that throw an error', async () => {
    const twoPrimaryTemplate = require(`${mockPath}/two-primary-template.js`);
    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(200, require(`${mockPath}/fragment.js`), mockContentType)
    );

    expect(() => new Spalatum(twoPrimaryTemplate).render())
      .toThrow(
        new PrimaryFragmentException('Must have only one fragment tag as primary')
      );
  });
});

describe('# Testing a cached request', async () => {
  it('Calling Spalatum with a cached request, I expect that returns the same template without request this fragment again', async () => {
    const cacheObject = {};
    const originalTemplate = require(`${mockPath}/cache-template.js`);

    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(200, require(`${mockPath}/fragment.js`), mockContentType)
    );

    let renderedTemplate = await new Spalatum(originalTemplate, cacheObject).render();
    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
    expect(Object.keys(cacheObject).length)
      .toEqual(2);
    expect(cacheObject[Object.keys(cacheObject)[0]])
      .toEqual(expect.objectContaining({
        content: expect.any(String),
        timestamp: expect.any(String),
      }));

    expect(global.superagent.get).toHaveBeenCalledTimes(2);

    const mockedDate = new Date();
    mockedDate.setMinutes(mockedDate.getMinutes() + 5);
    mockdate.set(mockedDate);

    renderedTemplate = await new Spalatum(originalTemplate, cacheObject).render();
    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();

    expect(global.superagent.get).toHaveBeenCalledTimes(2);
  });

  it('Calling Spalatum with a cached but expired request, I expect the fragment is requested again', async () => {
    const cacheObject = {};
    const originalTemplate = require(`${mockPath}/cache-template.js`);

    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(200, require(`${mockPath}/fragment.js`), mockContentType)
    );

    let renderedTemplate = await new Spalatum(originalTemplate, cacheObject).render();
    document.body.outerHTML = renderedTemplate;

    expect(document.body.outerHTML).toMatchSnapshot();
    expect(global.superagent.get).toHaveBeenCalledTimes(2);

    const mockedDate = new Date();
    mockedDate.setMinutes(mockedDate.getMinutes() + 11);
    mockdate.set(mockedDate);

    renderedTemplate = await new Spalatum(originalTemplate, cacheObject).render();
    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();

    expect(global.superagent.get).toHaveBeenCalledTimes(4);
  });
});

describe('# Testing cache methods', () => {
  it('Cache contents and retrieve its href and timestamps', async () => {
    const originalTemplate = require(`${mockPath}/cache-template.js`);

    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(200, require(`${mockPath}/fragment.js`), mockContentType)
    );

    const spalatum = new Spalatum(originalTemplate);
    await spalatum.render();

    expect(Spalatum.getCache()).toEqual(global.cache);
  });

  it('Remove a specific cache item by endpoint', async () => {
    const endpoints = [
      'http://localhost:9000/',
      'http://localhost:9001/',
    ];

    const cacheItem = {
      content: 'blablabla',
      timestamp: moment().format(),
    };

    global.cache[endpoints[0]] = cacheItem;
    global.cache[endpoints[1]] = cacheItem;

    expect(Spalatum.removeCacheByEndpoint(endpoints[0])).toBe(true);
    expect(Object.keys(Spalatum.getCache()).length).toBe(1);

    expect(Spalatum.removeCacheByEndpoint(endpoints[0])).toBe(false);

    expect(Object.keys(global.cache)[0]).toBe(endpoints[1]);
  });
});
