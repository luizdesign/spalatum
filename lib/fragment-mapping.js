const fetchFragment = require('./fetch-fragment');
const ParameterException = require('./exceptions/parameterException.js');

/**
 * Returns an array of the fragments identified in template
 *
 * @param  {String} template [string of the template html]
 * @return {Array}
 */
const fragmentIdentifier = (template) => {
  const fragmentMatch = new RegExp(/<fragment[^>]+>/, 'gm');

  return template.match(fragmentMatch) || [];
};

/**
 * Validate the template parameter
 *
 * @param  {String} template [string of the template html]
 * @return {Mixed: ParameterException|undefined}
 */
const validateParameters = (template) => {
  if (typeof template === 'undefined') {
    throw new ParameterException('template is mandatory');
  }
  if (typeof template !== 'string') {
    throw new ParameterException('template must be a string');
  }
};

/**
 * Extract the fragment's url
 * @param  {String} fragment [fragment tag string]
 * @return {String}
 */
const parseFragment = (fragment) => {
  const fragmentUriMatch = new RegExp(/href="([^"]+)"/);
  const uri = fragment.match(fragmentUriMatch)[1];

  return uri;
};

/**
 * Returns the fragment tag object
 * @param  {String} fragment [fragment tag string]
 * @return {Object}
 */
const fragmentLookup = async (fragment) => {
  const uri = parseFragment(fragment);
  const content = await fetchFragment(uri);

  return {
    id: fragment,
    content,
  };
};

/**
 * Mapping the fragments in template
 *
 * @param  {String} template [string of the template html]
 * @return {Promise}
 */
const fragmentMapping = (template) => {
  validateParameters(template);

  return new Promise((resolve, reject) => {
    const fragments = fragmentIdentifier(template);

    if (fragments.length === 0) {
      reject(template);
    }

    resolve(fragments.map(fragmentLookup));
  });
};

module.exports = fragmentMapping;