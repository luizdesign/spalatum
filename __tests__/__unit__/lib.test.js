const mockdate = require('mockdate');
const originalSuperagent = require('superagent');
const superagentProxy = require('superagent-proxy');

const mockPath = '../../__mocks__';
const libPath = '../../lib';

const lib = require(`${libPath}/index.js`);
const ParameterException = require(`${libPath}/exceptions/parameterException.js`);
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
  it('Calling the render with an generic error in the fragment request, I expect that returns the template with the fragments rendered in blank', async () => {
    const genericErrorTemplate = require(`${mockPath}/error-template.js`);
    const renderedGenericErrorTemplate = await lib(genericErrorTemplate, {});
    document.body.outerHTML = renderedGenericErrorTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
  });

  it('Calling the render with a not found error in the fragment request, I expect that returns the template with the fragments rendered in blank', async () => {
    const notFoundErrorTemplate = require(`${mockPath}/notfound-template.js`);
    const renderedNotFoundErrorTemplate = await lib(notFoundErrorTemplate);
    document.body.outerHTML = renderedNotFoundErrorTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
  });

  it('Calling the render with an invalid content type in the fragment request, I expect that returns the template with the fragments rendered in blank', async () => {
    const simpleTemplate = require(`${mockPath}/simple-template.js`);
    global.superagent.get = jest.fn().mockReturnValue(
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
    const originalTemplate = require(`${mockPath}/proxy-template.js`);
    const mockServer = require(`${mockPath}/server.js`)('./fragment.js');
    const mockProxyServer = require(`${mockPath}/proxy-server.js`)('http://localhost:7000');
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
    const originalTemplate = require(`${mockPath}/simple-template.js`);
    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(200, require(`${mockPath}/fragment.js`), mockContentType)
    );

    const renderedTemplate = await lib(originalTemplate);
    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
  });
});

describe('# Testing a cached request', async () => {
  it('Calling the render with a cached request, I expect that returns the same template without request this fragment again', async () => {
    const cacheObject = {};
    const originalTemplate = require(`${mockPath}/cache-template.js`);

    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(200, require(`${mockPath}/fragment.js`), mockContentType)
    );

    let renderedTemplate = await lib(originalTemplate, cacheObject);
    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();

    expect(Object.keys(cacheObject).length)
      .toEqual(1);
    expect(cacheObject[Object.keys(cacheObject)[0]])
      .toEqual(jasmine.objectContaining({
        content: expect.any(String),
        timestamp: expect.any(String),
      }));

    expect(global.superagent.get).toHaveBeenCalledTimes(1);

    const mockedDate = new Date();
    mockedDate.setMinutes(mockedDate.getMinutes() + 5);
    mockdate.set(mockedDate);

    renderedTemplate = await lib(originalTemplate, cacheObject);
    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();

    expect(global.superagent.get).toHaveBeenCalledTimes(1);
  });

  it('Calling the render with a cached but expired request, I expect the fragment is requested again', async () => {
    const cacheObject = {};
    const originalTemplate = require(`${mockPath}/cache-template.js`);

    global.superagent.get = jest.fn().mockReturnValue(
      responseMock(200, require(`${mockPath}/fragment.js`), mockContentType)
    );

    let renderedTemplate = await lib(originalTemplate, cacheObject);
    document.body.outerHTML = renderedTemplate;

    expect(document.body.outerHTML).toMatchSnapshot();
    expect(global.superagent.get).toHaveBeenCalledTimes(1);

    const mockedDate = new Date();
    mockedDate.setMinutes(mockedDate.getMinutes() + 11);
    mockdate.set(mockedDate);

    renderedTemplate = await lib(originalTemplate, cacheObject);
    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();

    expect(global.superagent.get).toHaveBeenCalledTimes(2);
  });
});
