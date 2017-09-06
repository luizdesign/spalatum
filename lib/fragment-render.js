/**
 * Replace the fragment tag for the your content
 *
 * @param  {String} template [string of the template html]
 * @param  {Array} mapping  [array of mapped fragments]
 * @return {Promise}
 */
const fragmentRender = (template, mapping) =>
  new Promise((resolve) => {
    let loadedFragments = 0;
    let renderedTemplate = template;

    mapping.forEach(async (map) => {
      const fetchMapping = await map;

      renderedTemplate = renderedTemplate.replace(
        `${fetchMapping.id}`,
        fetchMapping.content,
      );

      loadedFragments += 1;
      if (loadedFragments === mapping.length) {
        resolve(renderedTemplate);
      }
    });
  });

module.exports = fragmentRender;
