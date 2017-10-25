const templateAssetsFilter = (template) => {
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

  // console.log(scripts);
  // console.log(srcs);
  // console.log('========================');
  // console.log(duplicates);

  duplicates.forEach((item) => {
    const regex = new RegExp(`<script.*?src=.*?["'](${item})["'].*?>(</script>)?`, 'mg');
    const items = template.match(regex);
    // const toRemove = items.slice(1);

    // console.log('========================');
    // console.log(`Item ${item}`);
    // console.log('========================');
    // console.log('Items', items);
    // console.log('========================');
    // console.log('To remove', toRemove);
    // console.log('========================');


    templateFiltered = templateFiltered.replace(items[0], items[0].replace('src=', 'data-original src='));

    items.forEach((itemToRemove) => {
      templateFiltered = templateFiltered.replace(itemToRemove, '');
    });
  });

  return templateFiltered;
};

module.exports = templateAssetsFilter;
