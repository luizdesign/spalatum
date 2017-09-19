const lib = require('../lib/index.js');
const fs = require('fs');
const mockdate = require('mockdate');
const originalSuperagent = require('superagent');
const superagentProxy = require('superagent-proxy');
const ParameterException = require('../lib/exceptions/parameterException.js');
const responseMock = require('../__mocks__/response');

const originalGet = originalSuperagent.get;
const mockContentType = 'text/html';

beforeEach(() => {
  document.body.outerHTML = null;
  global.superagent = originalSuperagent;
  superagentProxy(superagent);
  superagent.get = originalGet;
  cache = {};
  mockdate.reset();
});

describe('# Testing render configuration', () => {
  it('Calling the render without the template parameter, I expect that returns a exception', () => {
    expect(() => lib())
      .toThrow(
        new ParameterException('template is mandatory')
      );
  });
  it('Calling the render with the template parameter different of a string, I expect that returns a exception', () => {
    expect(() => lib(42))
      .toThrow(
        new ParameterException('template must be a string')
      );
  });
});

describe('# Testing a template with error in fragment request', async () => {
  it('Calling the render with error in the fragment request, I expect that returns the template with the fragments rendered in blank', async () => {
    const genericErrorTemplate = require('../__mocks__/error-template.js');
    const renderedGenericErrorTemplate = await lib(genericErrorTemplate, {});
    document.body.outerHTML = renderedGenericErrorTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();

    const notFoundErrorTemplate = require('../__mocks__/notfound-template.js');
    const renderedNotFoundErrorTemplate = await lib(notFoundErrorTemplate);
    document.body.outerHTML = renderedNotFoundErrorTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();

    const simpleTemplate = require('../__mocks__/simple-template.js');
    superagent.get = jest.fn().mockReturnValue(
      responseMock(200, simpleTemplate, 'application/json')
    );

    const renderedSimpleTemplate = await lib(simpleTemplate);
    document.body.outerHTML = renderedSimpleTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
  });
});

describe('# Testing a template without fragments', async () => {
  it('Calling the lib with the template with no fragments, I expect that returns the same template', async () => {
    const originalTemplate = '<html><head></head><body><h1>Unit test</h1></body></html>';
    const renderedTemplate = await lib(originalTemplate);
    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
  });
});

describe('# Testing a template with fragments using proxy', async () => {
  it('Calling the render with the template with fragments using proxy, I expect that returns the template with the fragments rendered', async () => {
    const originalTemplate = require('../__mocks__/proxy-template.js');
    const mockServer = require('../__mocks__/server.js')('../__mocks__/fragment.js');
    const mockProxyServer = require('../__mocks__/proxy-server.js')('http://localhost:7000');
    mockProxyServer.listen(5000);
    mockServer.listen(7000);

    const renderedTemplate = await lib(originalTemplate);
    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
    mockServer.close();
    mockProxyServer.close();
  });
});

describe('# Testing a template with fragments', async () => {
  it('Calling the render with the template with fragments, I expect that returns the template with the fragments rendered', async () => {
    const originalTemplate = require('../__mocks__/simple-template.js');
    superagent.get = jest.fn().mockReturnValue(
      responseMock(200, require('../__mocks__/fragment.js'), mockContentType)
    );

    const renderedTemplate = await lib(originalTemplate);
    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
  });
});

describe('# Testing a cached request', async () => {
  it('Calling the render with a cached request, I expect that returns the same template without request this fragment again', async () => {
    const cacheObject = {};
    const originalTemplate = require('../__mocks__/cache-template.js');

    superagent.get = jest.fn().mockReturnValue(
      responseMock(200, require('../__mocks__/fragment.js'), mockContentType)
    );

    let renderedTemplate = await lib(originalTemplate, cacheObject);
    const objectContains = jasmine.objectContaining;
    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();

    expect(Object.keys(cacheObject).length)
      .toEqual(1);
    expect(cacheObject[Object.keys(cacheObject)[0]])
      .toEqual(objectContains({
        content: expect.any(String),
        timestamp: expect.any(String),
      }));

    expect(superagent.get).toHaveBeenCalledTimes(1);

    const mockedDate = new Date();
    mockedDate.setMinutes(mockedDate.getMinutes() + 5);
    mockdate.set(mockedDate);

    renderedTemplate = await lib(originalTemplate, cacheObject);
    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();

    expect(superagent.get).toHaveBeenCalledTimes(1);
  });

  it('Calling the render with a cached but expired request, I expect the fragment is requested again', async () => {
    const cacheObject = {};
    const originalTemplate = require('../__mocks__/cache-template.js');

    superagent.get = jest.fn().mockReturnValue(
      responseMock(200, require('../__mocks__/fragment.js'), mockContentType)
    );

    let renderedTemplate = await lib(originalTemplate, cacheObject);
    const objectContains = jasmine.objectContaining;
    document.body.outerHTML = renderedTemplate;

    expect(document.body.outerHTML).toMatchSnapshot();
    expect(superagent.get).toHaveBeenCalledTimes(1);

    const mockedDate = new Date();
    mockedDate.setMinutes(mockedDate.getMinutes() + 11);
    mockdate.set(mockedDate);

    renderedTemplate = await lib(originalTemplate, cacheObject);
    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();

    expect(superagent.get).toHaveBeenCalledTimes(2);
  });
});
