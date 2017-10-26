const cheerio = require('cheerio');

const templateAssetsFilter = (template) => {
  if (typeof template !== 'string') return '';

  const $ = cheerio.load(template, {
    xmlMode: true,
    ignoreWhitespace: true,
  });

  const srcs = $('script')
    .toArray()
    .map(item => item.attribs.src)
    .sort()
    .filter((item, index, list) => item === list[index + 1])
    .filter((item, index, list) => list.indexOf(item) === index);

  srcs.forEach((src) => {
    const items = $(`script[src="${src}"]`).toArray().slice(1);
    items.forEach(element => $(element).remove());
  });

  return $.html();
};

module.exports = templateAssetsFilter;
