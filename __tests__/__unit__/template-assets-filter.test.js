const module = require('../../lib/template-assets-filter.js');
const templates = require('../../__mocks__/templates.js');

describe('Javascript assets filter', () => {
  it('When execute the module with a template with no assets, I expect it doesn\'t change the content', () => {
    const result = module(templates.simple);
    expect(result).toBe(templates.simple);
    expect(typeof result).toBe('string');
    expect(module('')).toBe('');
    expect(module()).toBe('');
  });

  it('When execute the module with a template with duplicated assets I expect it remove subsequent duplicates', () => {
    const template = `
    <section>
      <header>
        <script src="foo.com/react.js"></script>
        <script src="foo.com/asset.js"></script>
        <script src='foo.com/react.js'></script>
        <script src="foo.com/asset.js"></script>
      </header>
    </section>
    `;

    const result = `
    <section>
      <header>
        <script data-original src="foo.com/react.js"></script>
        <script data-original src="foo.com/asset.js"></script>
      </header>
    </section>
    `;

    expect(module(template)).toBe(result);
  });

  it('When execute the module with a minified template with duplicated assets, I expect it remove subsequent duplicates', () => {
    const template = '<body><span>unit test</span><script src="foo.com/react.js"></script><script src="foo.com/asset.js"></script><script src="foo.com/react.js"></script><script src="foo.com/asset.js"></script></body>';
    const result = '<body><span>unit test</span><script data-original src="foo.com/react.js"></script><script data-original src="foo.com/asset.js"></script></body>';

    expect(module(template)).toBe(result);
  });
});
