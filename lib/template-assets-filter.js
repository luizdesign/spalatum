const $ = require('cheerio');
const minify = require('html-minifier').minify;

const attrName = (tag) => {
  const attributeName = tag === 'script' ? 'src' : 'href';
  return attributeName;
};

const endpoints = $elements =>
  $elements
    .toArray()
    .map($item => $item.attribs[attrName($item.name)])
    .filter((item, index, list) => list.indexOf(item) === index);

const removeDuplicates = ($elements) => {
  if (!$elements[0]) return;

  const tag = $elements[0].name;
  const attr = attrName(tag);

  endpoints($elements).forEach((endpoint) => {
    const items = $elements
      .filter(`${tag}[${attr}="${endpoint}"]`)
      .toArray()
      .slice(1);

    items.forEach(element => $(element).remove());
  });
};

module.exports = (template) => {
  const templateString = (template && typeof template === 'string') ? template : '';

  const $template = $.load(templateString);

  removeDuplicates($template('link'));
  removeDuplicates($template('script'));

  return minify($template.html(), {
    collapseWhitespace: true,
  });
};
