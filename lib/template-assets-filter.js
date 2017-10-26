const $ = require('cheerio');

const getAttributeName = (tag) => {
  const attributeName = tag === 'script' ? 'src' : 'href';
  return attributeName;
};

const getEndpoints = $elements =>
  $elements
    .toArray()
    .map($item => $item.attribs[getAttributeName($item.name)])
    .filter((item, index, list) => list.indexOf(item) === index);

const removeDuplicates = ($elements) => {
  const endpoints = getEndpoints($elements);

  endpoints.forEach((endpoint) => {
    const elementName = $elements[0].name;

    const endpointAttribute = `${getAttributeName(elementName)}="${endpoint}"`;
    const items = $elements
      .filter(`${elementName}[${endpointAttribute}]`)
      .toArray()
      .slice(1);

    items.forEach(element => $(element).remove());
  });
};

const templateAssetsFilter = (template) => {
  if (typeof template !== 'string') return '';

  const $template = $.load(template, {
    xmlMode: true,
    ignoreWhitespace: true,
  });

  removeDuplicates($template('link'));
  removeDuplicates($template('script'));

  return $template.html();
};

module.exports = templateAssetsFilter;
