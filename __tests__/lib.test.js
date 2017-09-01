const lib = require('../lib/index.js');
const http = require('http');
const fs = require('fs');
const ParameterException = require('../lib/exceptions/parameterException.js');

const mockServer = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(require('../__mocks__/fragment.js'));
  res.end();
});
beforeEach(() => {
  mockServer.listen(8000);
  document.body.innerHTML = null;
});
afterEach(() => {
  mockServer.close();
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
    const template = await lib(originalTemplate);

    document.body.innerHTML = template;
    expect(document.body.innerHTML).toMatchSnapshot();
  });
});

describe('# Testing a template with fragments', async () => {
  it('Calling the render with the template with fragments, I expect that returns the template with the fragments rendered', async () => {
    const mock = require('../__mocks__/simple-fragment.js');
    const response = require('../__mocks__/fragment.js');

    const template = await lib(mock);
    document.body.innerHTML = template;
    expect(document.body.innerHTML).toMatchSnapshot();
  });
});
