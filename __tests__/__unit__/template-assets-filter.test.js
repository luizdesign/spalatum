const module = require('../../lib/template-assets-filter.js');
const templates = require('../../__mocks__/templates.js');

beforeEach(() => {
  document.outerHTML = null;
});

describe('Javascript assets filter', () => {
  it('When execute the module with a template with no assets, I expect it doesn\'t change the content', () => {
    document.outerHTML = module(templates.simple);
    expect(document.outerHTML).toMatchSnapshot();
    expect(typeof document.outerHTML).toBe('string');
  });

  it('When execute the module with an empty template, I expect it return an default empty html string', () => {
    document.outerHTML = module('');
    expect(document.outerHTML).toMatchSnapshot();
  });

  it('When execute the module with no template, I expect it return an default empty html string', () => {
    document.outerHTML = module();
    expect(document.outerHTML).toMatchSnapshot();
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

    document.outerHTML = module(template);
    expect(document.outerHTML).toMatchSnapshot();
  });

  it('When execute the module with a template with duplicated javascript assets with attributes and dirty content, I expect it remove subsequent duplicates without removing others content and attributes', () => {
    const template = `<section>
      <script src="foo.com/asset.js"></script>
      <header>
        <script async src="foo.com/react.js"></script>
        <script src="foo.com/asset.js" defer></script>
        <h1>Unit test</h1>
        <script src="foo.com/asset.js" defer></script>
      </header>
      <script src="foo.com/asset.js"></script>
      <script type="javascript" src='foo.com/react.js'></script>
    </section>`;

    document.outerHTML = module(template);
    expect(document.outerHTML).toMatchSnapshot();
  });

  it('When execute the module with a minified template with duplicated javascript assets, I expect it remove subsequent duplicates', () => {
    const template = '<body><span>unit test</span><script src="foo.com/react.js"></script><script src="foo.com/asset.js"></script><script src="foo.com/react.js"></script><script src="foo.com/asset.js"></script></body>';

    document.outerHTML = module(template);
    expect(document.outerHTML).toMatchSnapshot();
  });
});

describe('Styles assets filter', () => {
  it('When execute the module with a template with duplicated css assets, I expect it remove subsequent duplicate', () => {
    const template = `<section>
      <header>
        <link href="foo.com/react.css" rel="stylesheet" media="print">
        <link href="foo.com/asset.css">
        <link href="foo.com/react.css" rel="stylesheet" media="screen">
        <link href="foo.com/asset.css" rel="stylesheet">
      </header>
    </section>`;

    document.outerHTML = module(template);
    expect(document.outerHTML).toMatchSnapshot();
  });

  it('When execute the module with a template with duplicated css assets with attributes and dirty content, I expect it remove subsequent duplicates without removing others content and attributes', () => {
    const template = `<section>
      <link type="text/css" href="foo.com/react.css" rel="stylesheet" media="print">
      <header>
        <link href="foo.com/asset.css">
        <p>Unit test</p>
        <link href="foo.com/react.css" rel="stylesheet" media="screen">
      </header>
      <link href="foo.com/asset.css" type="text/css">
    </section>`;

    document.outerHTML = module(template);
    expect(document.outerHTML).toMatchSnapshot();
  });

  it('When execute the module with a minified template with duplicated css assets, I expect it remove subsequent duplicates', () => {
    const template = '<body><span>unit test</span><link href="foo.com/react.css"><link href="foo.com/asset.css"><link href="foo.com/react.css"><link href="foo.com/asset.css"></body>';

    document.outerHTML = module(template);
    expect(document.outerHTML).toMatchSnapshot();
  });
});
