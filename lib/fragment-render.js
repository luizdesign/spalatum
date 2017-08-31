const fragmentRender = (template, mapping) =>
  new Promise((resolve) => {
    let loadedFragments = 0;
    let renderedTemplate = template;

    mapping.forEach(async (map) => {
      const fetchMapping = await map;

      renderedTemplate = renderedTemplate.replace(
        `${fetchMapping.id}</fragment>`,
        fetchMapping.content,
      );

      loadedFragments += 1;
      if (loadedFragments === mapping.length) {
        resolve(renderedTemplate);
      }
    });
  });

module.exports = fragmentRender;
