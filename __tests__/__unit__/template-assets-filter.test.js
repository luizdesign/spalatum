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

  it('When execute the module with a template with duplicated javascript assets, I expect it remove subsequent duplicates', () => {
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

  it('When execute the module with a template with duplicated javascript assets with attributes and dirty content, I expect it remove subsequent duplicates without removing others content and  attributes', () => {
    const template = `<section>
      <script src="foo.com/asset.js"/>
      <header>
        <script async src="foo.com/react.js"></script>
        <script src="foo.com/asset.js" defer></script>
        <h1>Unit test</h1>
        <script src="foo.com/asset.js" defer/>
      </header>
      <script src="foo.com/asset.js"></script>
      <script type="javascript" src='foo.com/react.js'/>
    </section>`;

    expect(module(template)).toBe('<section> <script src=\"foo.com/asset.js\"/> <header> <script async src=\"foo.com/react.js\"/>  <h1>Unit test</h1>  </header>   </section>'); // eslint-disable-line no-useless-escape
  });

  it('When execute the module with a minified template with duplicated javascript assets, I expect it remove subsequent duplicates', () => {
    const template = '<body><span>unit test</span><script src="foo.com/react.js"></script><script src="foo.com/asset.js"></script><script src="foo.com/react.js"></script><script src="foo.com/asset.js"></script></body>';
    const result = '<body><span>unit test</span><script src="foo.com/react.js"/><script src="foo.com/asset.js"/></body>';

    expect(module(template)).toBe(result);
  });
});

describe('Styles assets filter', () => {
  it('When execute the module with a template with duplicated css assets, I expect it remove subsequent duplicate', () => {
    const template = `<section>
      <header>
        <link href="foo.com/react.css" rel="stylesheet" media="print"/>
        <link href="foo.com/asset.css" rel="stylesheet"/>
        <link href="foo.com/react.css" rel="stylesheet" media="screen"/>
        <link href="foo.com/asset.css" rel="stylesheet"/>
      </header>
    </section>`;

    const result = '<section> <header> <link href=\"foo.com/react.css\" rel="stylesheet" media="print"/> <link href=\"foo.com/asset.css\" rel="stylesheet"/>   </header> </section>'; // eslint-disable-line no-useless-escape

    expect(module(template)).toBe(result);
  });

  it('When execute the module with a template with duplicated css assets with attributes and dirty content, I expect it remove subsequent duplicates without removing others content and attributes', () => {
    const template = `<section>
      <link type="text/css" href="foo.com/react.css" rel="stylesheet" media="print"/>
      <header>
        <link href="foo.com/asset.css"/>
        <p>Unit test</p>
        <link href="foo.com/react.css" rel="stylesheet" media="screen"/>
      </header>
      <link href="foo.com/asset.css" type="text/css"/>
    </section>`;

    const result = '<section> <link type=\"text/css\" href=\"foo.com/react.css\" rel=\"stylesheet\" media=\"print\"/> <header> <link href=\"foo.com/asset.css\"/> <p>Unit test</p>  </header>  </section>'; // eslint-disable-line no-useless-escape

    expect(module(template)).toBe(result);
  });

  it('When execute the module with a minified template with duplicated css assets, I expect it remove subsequent duplicates', () => {
    const template = '<body><span>unit test</span><link href="foo.com/react.css"/><link href="foo.com/asset.css"><link href="foo.com/react.css"/><link href="foo.com/asset.css"/></body>';
    const result = '<body><span>unit test</span><link href="foo.com/react.css"/><link href="foo.com/asset.css"/></body>';

    expect(module(template)).toBe(result);
  });
});
