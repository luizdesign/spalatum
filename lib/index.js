const http = require('http');

const fetchFragment = uri =>
  new Promise((resolve, reject) => {
    let response = '';
    const request = http.get(uri, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        response += chunk;
      });
      res.on('end', () => {
        const body = response.replace(/\/static/g, 'http://www.catho.com.br/static');

        return resolve(body);
      });
    });
    request.on('error', (error) => {
      reject(new Error(error));
    });
  });

const fragmentMapping = (template) => {
  if (typeof template === 'undefined') {
    throw new Error('ParameterException: template is mandatory');
  }
  if (typeof template !== 'string') {
    throw new Error('ParameterException: template must be a string');
  }

  return new Promise((resolve, reject) => {
    try {
      const fragmentIdentifier = new RegExp(/<fragment[^>]+>/, 'gm');
      const fragmentUriIdentifier = new RegExp(/href="([^"]+)"/);
      const fragments = template.match(fragmentIdentifier);

      resolve(fragments.map(async (fragment) => {
        const uri = fragment.match(fragmentUriIdentifier)[1];
        const content = await fetchFragment(uri);

        return {
          id: fragment,
          content,
        };
      }));
    } catch (err) {
      reject(new Error(err));
    }
  });
};

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

module.exports = template => fragmentMapping(template)
  .then(mapping => fragmentRender(template, mapping));
