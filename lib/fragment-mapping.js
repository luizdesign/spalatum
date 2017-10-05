const fragmentFetching = require('./fragment-fetching');
const fragmentAttributes = require('./fragment-attributes');
const ParameterException = require('./exceptions/parameterException');
const PrimaryFragmentException = require('./exceptions/primaryFragmentException');

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
 * Validate if have more than one fragment with primary attribute
 * @param {Array} list with all fragment tags
 * @return {Mixed: PrimaryFragmentException|undefined}
 */
const validatePrimaryFragment = (fragments) => {
  const primaryMatch = new RegExp(/primary/);
  let primaryFragments = 0;

  fragments.forEach((fragment) => {
    if (primaryMatch.test(fragment)) {
      primaryFragments += 1;
    }
  });

  if (primaryFragments > 1) {
    throw new PrimaryFragmentException('Must have only one primary fragment');
  }
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
 * Extract the fragment's attributes
 * @param  {String} fragment [fragment tag string]
 * @return {Object} Object with fragments attributes
 */
const parseFragment = fragment =>
  fragmentAttributes(fragment);

/**
 * Returns the fragment tag object
 * @param  {String} fragment [fragment tag string]
 * @return {Object}
 */
const fragmentLookup = async (fragment) => {
  const attributes = parseFragment(fragment);
  const content = await fragmentFetching(attributes);

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
  const fragments = fragmentIdentifier(template);
  validatePrimaryFragment(fragments);

  return new Promise((resolve, reject) => {
    if (fragments.length === 0) {
      reject(template);
    }

    resolve(fragments.map(fragmentLookup));
  });
};

module.exports = fragmentMapping;
