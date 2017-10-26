const templateAssetsFilter = (template) => {
  if (typeof template !== 'string') return '';

  const scriptPattern = /<script.*?src=.*?["'](.*?)["'].*?>(<\/script>)?/gm;
  const srcPattern = /^.*?src=["'](.*?)["'].*/gm;

  const scripts = template.match(scriptPattern) || [];

  const srcs = (scripts).map(srcStr =>
    srcStr.match(srcPattern)[0].replace(srcPattern, '$1'),
  );

  const duplicates = srcs
    .sort()
    .filter((item, index, list) => item === list[index + 1])
    .filter((item, index, list) => list.indexOf(item) === index);

  let templateFiltered = template;

  duplicates.forEach((item) => {
    const regex = new RegExp(`\\s*<script\\s*(\w*(=("[^"]*"|'[^']*'))?\s)*src=["']?${item}["']?\s*(\w*(=("[^"]*"|'[^']*'))?\s)*>(<\/script>)?`, 'mg'); // eslint-disable-line no-useless-escape
    const items = template.match(regex);
    templateFiltered = templateFiltered.replace(items[0], items[0].replace('src=', 'data-original src='));

    items.forEach((itemToRemove) => {
      templateFiltered = templateFiltered.replace(itemToRemove, '');
    });
  });

  return templateFiltered;
};

module.exports = templateAssetsFilter;
