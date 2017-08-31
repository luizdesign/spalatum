const lib = require('../lib/index.js');

describe('# Testing render configuration', () => {
  it('Calling the render without the template parameter, I expect that returns a exception', () => {
    expect(() => lib())
      .toThrow();
  });
  it('Calling the render with the template parameter different of a string, I expect that returns a exception', () => {
    expect(() => lib(42))
      .toThrow();
  });
});
