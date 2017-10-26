const module = require('../../lib/template-assets-filter.js');
const templates = require('../../__mocks__/templates.js');

describe('Javascript assets filter', () => {
  it('When execute the module with a template with no assets, I expect it doesn\'t change the content', () => {
    const result = module(templates.simple);
    expect(result).toBe('<!DOCTYPE html> <html lang=\"en\"> <head> <meta charset=\"UTF-8\"/> <title>Unit Test</title> </head> <body> <fragment href=\"http://localhost:8000/\"/> </body> </html>'); // eslint-disable-line no-useless-escape
    expect(typeof result).toBe('string');
    expect(module('')).toBe('');
    expect(module()).toBe('');
  });

  it('When execute the module with a template with duplicated javascript assets I expect it remove subsequent duplicates', () => {
    const template = `<section>
      <header>
        <script src="foo.com/react.js"></script>
        <script src="foo.com/asset.js"></script>
        <script src='foo.com/react.js'></script>
        <script src="foo.com/asset.js"></script>
      </header>
    </section>`;

    const result = '<section> <header> <script src=\"foo.com/react.js\"/> <script src=\"foo.com/asset.js\"/>   </header> </section>'; // eslint-disable-line no-useless-escape

    expect(module(template)).toBe(result);
  });

  it('When execute the module with a minified template with duplicated javascript assets, I expect it remove subsequent duplicates', () => {
    const template = '<body><span>unit test</span><script src="foo.com/react.js"></script><script src="foo.com/asset.js"></script><script src="foo.com/react.js"></script><script src="foo.com/asset.js"></script></body>';
    const result = '<body><span>unit test</span><script src="foo.com/react.js"/><script src="foo.com/asset.js"/></body>';

    expect(module(template)).toBe(result);
  });
});
