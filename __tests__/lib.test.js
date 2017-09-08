const lib = require('../lib/index.js');
const fs = require('fs');
const ParameterException = require('../lib/exceptions/parameterException.js');

beforeEach(() => {
  document.body.innerHTML = null;
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

describe('# Testing a template without fragments', async () => {
  it('Calling the lib with the template with no fragments, I expect that returns the same template', async () => {
    const originalTemplate = '<html><head></head><body><h1>Unit test</h1></body></html>';
    const renderedTemplate = await lib(originalTemplate);

    document.body.innerHTML = renderedTemplate;
    expect(document.body.innerHTML).toMatchSnapshot();
  });
});

describe('# Testing a template with fragments', async () => {
  it('Calling the render with the template with fragments, I expect that returns the template with the fragments rendered', async () => {
    const originalTemplate = require('../__mocks__/simple-fragment.js');
    const mockServer = require('../__mocks__/server.js')('../__mocks__/fragment.js');
    mockServer.listen(8000);

    const renderedTemplate = await lib(originalTemplate);
    document.body.innerHTML = renderedTemplate;
    expect(document.body.innerHTML).toMatchSnapshot();
    mockServer.close();
  });
});

describe('# Testing a template with fragments using proxy', async () => {
  it('Calling the render with the template with fragments using proxy, I expect that returns the template with the fragments rendered', async () => {
    const originalTemplate = require('../__mocks__/proxy-fragment.js');
    const mockServer = require('../__mocks__/server.js')('../__mocks__/fragment.js');
    const mockProxyServer = require('../__mocks__/proxy-server.js')('http://localhost:7000');
    mockProxyServer.listen(5000);
    mockServer.listen(7000);

    const renderedTemplate = await lib(originalTemplate);
    document.body.innerHTML = renderedTemplate;
    expect(document.body.innerHTML).toMatchSnapshot();
    mockServer.close();
    mockProxyServer.close();
  });
});
