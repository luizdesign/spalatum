const fragmentFetching = require('./fragment-fetching');
const { getFragmentAttributes, identifiers } = require('./fragment-attributes');
const ParameterException = require('./exceptions/parameterException');
const PrimaryFragmentException = require('./exceptions/primaryFragmentException');

/**
 * Returns an array of the fragments identified in template
 *
 * @param  {String} template [string of the template html]
 *
 * @return {Array}
 */
const fragmentIdentifier = (template) => {
  const fragmentMatch = new RegExp(/<fragment[^>]+>/, 'gm');

  return template.match(fragmentMatch) || [];
};

/**
 * Validate if have more than one fragment with primary attribute
 *
 * @param {Array} list with all fragment tags
 *
 * @return {Mixed: PrimaryFragmentException|undefined}
 */
const validatePrimaryFragment = (fragments) => {
  const primaryMatch = identifiers.primaryAttributeIdentifier;
  let primaryFragments = 0;

  fragments.forEach((fragment) => {
    if (primaryMatch.test(fragment)) {
      primaryFragments += 1;
    }
  });

  if (primaryFragments > 1) {
    throw new PrimaryFragmentException('Must have only one fragment tag as primary');
  }
};

/**
 * Validate the template parameter
 *
 * @param  {String} template [string of the template html]
 *
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
 *
 * @param  {String} fragment [fragment tag string]
 *
 * @return {Object} Object with fragments attributes
 */
const parseFragment = fragment =>
  getFragmentAttributes(fragment);

/**
 * Returns the fragment tag object
 *
 * @param  {String} fragment [fragment tag string]
 * @param  {String} fragment [request options]
 *
 * @return {Object}
 */
const fragmentLookup = async (fragment, options) => {
  const attributes = parseFragment(fragment);
  const content = await fragmentFetching(attributes, options);

  return {
    id: fragment,
    content,
  };
};

/**
 * Mapping the fragments in template
 *
 * @param  {String} template [string of the template html]
 * @param  {String} template [request options]
 *
 * @return {Promise}
 */
const fragmentMapping = (template, options) => {
  validateParameters(template);
  const fragments = fragmentIdentifier(template);
  validatePrimaryFragment(fragments);

  return new Promise(async (resolve, reject) => {
    if (fragments.length === 0) {
      resolve(template);
    }

    const fragmentList = [];

    for (let i = 0; i < fragments.length; i += 1) {
      try {
        fragmentList.push(await fragmentLookup(fragments[i], options));
      } catch (errorTemplate) {
        if (process.env.NODE_ENV === 'production') {
          reject(errorTemplate);
        } else {
          resolve(errorTemplate);
        }
        break;
      }
    }

    resolve(fragmentList);
  });
};

module.exports = fragmentMapping;
