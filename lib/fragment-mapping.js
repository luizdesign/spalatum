const fetchFragment = require('./fetch-fragment');
const ParameterException = require('./exceptions/parameterException.js');

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

module.exports = fragmentMapping;
