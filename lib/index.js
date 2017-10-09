const {
  fragmentMapping,
  getFragmentsAttributes,
} = require('./fragment-mapping');
const fragmentRender = require('./fragment-render');
const fragmentCache = require('./fragment-caching');

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
  constructor(template, cacheObject = {}) {
    this.template = template;
    global.cache = cacheObject;
  }

  /**
   * @return {String} [The parsed template]
   */
  render() {
    return fragmentMapping(this.template)
      // There are fragments
      .then(mapping => fragmentRender(this.template, mapping))
      // There is no fragment
      .catch(originalTemplate => originalTemplate);
  }

  /**
   * @return {Array} Cache items
   */
  getCacheList() {
    return getFragmentsAttributes(this.template).map((attrs) => {
      const md5Key = fragmentCache.getCacheKey(attrs.href);

      return {
        href: attrs.href,
        timestamp: cache[md5Key].timestamp,
      };
    });
  }
}

module.exports = Spalatum;
