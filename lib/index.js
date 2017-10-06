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
  constructor(template, cacheObject = {}) {
    this.template = template;
    global.cache = cacheObject;
  }

  /**
   * @return {String} [The parsed template]
   */
  render() {
    return fragmentMapping(this.template).then(mapping => (
      Array.isArray(mapping) ? fragmentRender(this.template, mapping) : this.template
    ));
  }
}

module.exports = Spalatum;
