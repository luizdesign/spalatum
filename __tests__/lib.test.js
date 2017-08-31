const lib = require('../lib/index.js');
const ParameterException = require('../lib/exceptions/parameterException.js');

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

describe('# Testing a template without fragments', () => {
  it('Calling the render with the template with no fragments, I expect that returns the same template', async () => {
    const mock = '<html><head></head><body><h1>Unit test</h1></body></html>';
    const template = await lib(mock);

    expect(template).toEqual(mock);
  });
});
