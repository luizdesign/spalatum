const http = require('http');
const ParameterException = require('./exceptions/parameterException.js');

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

const fragmentIdentifier = (template) => {
  const fragmentMatch = new RegExp(/<fragment[^>]+>/, 'gm');

  return template.match(fragmentMatch) || [];
};

const fragmentMapping = (template) => {
  if (typeof template === 'undefined') {
    throw new ParameterException('template is mandatory');
  }
  if (typeof template !== 'string') {
    throw new ParameterException('template must be a string');
  }

  return new Promise((resolve, reject) => {
    const fragments = fragmentIdentifier(template);

    if (fragments.length === 0) {
      reject(template);
    }

    resolve(fragments.map(async (fragment) => {
      const fragmentUriMatch = new RegExp(/href="([^"]+)"/);
      const uri = fragment.match(fragmentUriMatch)[1];
      const content = await fetchFragment(uri);

      return {
        id: fragment,
        content,
      };
    }));
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
  // There is fragments
  .then(mapping => fragmentRender(template, mapping))
  // There is no fragment
  .catch(originalTemplate => originalTemplate);
