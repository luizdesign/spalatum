const fragmentMapping = require('./fragment-mapping');
const fragmentRender = require('./fragment-render');

/**
 * Cache global object
 * @type {Object}
 */
global.cache = {};

/**
 * Exporting the public method
 * @param  {String} template    [The original template]
 * @param  {Object} cacheObject [The reference of application cache object]
 * @return {String}             [The parsed template]
 */
module.exports = (template, cacheObject = {}) => {
  cache = cacheObject;

  return fragmentMapping(template).then(mapping => (
    Array.isArray(mapping) ? fragmentRender(template, mapping) : template
  ));
};
