const fragmentMapping = require('./fragment-mapping');
const fragmentRender = require('./fragment-render');
const Cache = require('./Cache');

const cacheInstance = new Cache();

/**
 * Spalatum object
 */
module.exports = {
  /**
   * @param {string} template - The template to be parsed
   * @param {Object} options - The request options
   * @return {String} [The parsed template]
   */
  render: (template, options = {}) =>
    fragmentMapping(template, options).then(mapping => (
      Array.isArray(mapping) ? fragmentRender(template, mapping) : mapping
    )),

  /**
   * Get cache object
   * @return {Array} [Cache items]
   */
  getCache: () => cacheInstance.cacheObject,

  /**
   * Remove a specific cache item by endpoint
   * @param {String} endpoint [The fragment endpoint]
   * @return {Bool} [Flag that indicates that remove was successful]
   */
  clearCacheItem: endpoint => cacheInstance.clearItem(endpoint),

  /**
   * Remove all cache items from global.cache object
   * @return {Bool} [Flag that indicates that remove was successful]
  */
  clearAllCache: () => cacheInstance.clearAll(),
};
