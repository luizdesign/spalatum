const fragmentMapping = require('./fragment-mapping');
const fragmentRender = require('./fragment-render');

/**
 * Cache global object
 * @type {Object}
 */
global.cache = {};

/**
 * Spalatum class
 */
class Spalatum {
  /**
   * @param {String} template    [The original template]
   * @param {Object} cacheObject [The reference of application cache object]
   */
  constructor(cacheObject = {}) {
    global.cache = cacheObject;
  }

  /**
   * @return {String} [The parsed template]
   */
  static render(template) {
    return fragmentMapping(template).then(mapping => (
      Array.isArray(mapping) ? fragmentRender(template, mapping) : template
    ));
  }

  /**
   * @return {Array} [Cache items]
   */
  static getCache() {
    return global.cache;
  }

  /**
   * Remove a specific cache item by endpoint
   * @param {String} endpoint [The fragment endpoint]
   * @return {Bool} [Flag that indicates that remove was successful]
   */
  static removeCacheByEndpoint(endpoint) {
    if (!global.cache[endpoint]) return false;

    return delete global.cache[endpoint];
  }

  /**
   * Remove all cache items from global.cache object
   * @return {Bool} [Flag that indicates that remove was successful]
  */
  static removeAllCache() {
    global.cache = {};
    return global.cache;
  }
}

module.exports = Spalatum;
