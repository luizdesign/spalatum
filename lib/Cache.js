const transform = require('./transform');
const fragmentCacheExpiring = require('./fragment-cache-expiring');
const requestValidation = require('./request-validation');

/**
 * Validation rules to validate request
 * @property {Number} acceptStatusCode [Acceptable status code]
 * @property {String} acceptContentType [Acceptable content type]
 * @property {Number} acceptMinContentLength [Acceptable minimum content length]
 */
const validateObject = {
  acceptStatusCode: 200,
  acceptContentType: 'text/html',
  acceptMinContentLength: 50,
};

/**
 * Cache class instance
 */
let instance = null;

/**
 * Singleton class to manage fragment caching
 */
module.exports = class {
  constructor() {
    if (!instance) {
      instance = this;
    }

    this.cacheObject = {};

    return instance;
  }

  /**
   * Validate if can save the cache object
   * @param  {String|Null} maxAge    [Max age for the cache]
   * @param  {Object} responseObject [Response object]
   * @return {Boolean}
   */
  static canSave(maxAge, responseObject) {
    return requestValidation.validateRequest(validateObject, responseObject) && maxAge !== null;
  }

  /**
   * Create or Update the key in cache with the content
   * @param  {String} key     [Original Key to organizing the cache object]
   * @param  {String} maxAge  [Cache max age]
   * @param  {String} content [Content to save in cache]
   * @return {Undefined}
   */
  save(key, maxAge, content) {
    if (!this.isCached(key)) {
      this.cacheObject[key] = {
        content: transform.toBase64(content),
        timestamp: fragmentCacheExpiring.getExpireTime(maxAge),
      };
    }
  }

  /**
   * Recover the cache value stored as key on cache
   * @param  {String} key [Original key]
   * @return {String}
   */
  getItem(key) {
    const cacheItem = this.cacheObject[key];

    if (!cacheItem) return null;

    const cacheValue = JSON.parse(JSON.stringify(cacheItem));
    cacheValue.content = transform.toStringFromBase64(cacheValue.content);

    return cacheValue;
  }

  /**
   * Validate if exists cache for this key
   * @param  {String} key [Original Key]
   * @return {Boolean}
   */
  isCached(key) {
    return this.cacheObject[key] !== undefined
      && !fragmentCacheExpiring.validadeCacheExpire(this.getItem(key).timestamp);
  }

  /**
   * Remove a cache item by it endpoint
   * @param {String} cache endpoint
   * @return {Boolean}
   */
  clearItem(endpoint) {
    if (!this.cacheObject[endpoint]) return false;

    return delete this.cacheObject[endpoint];
  }

  /**
   * Remove all cache from cacheObject
   * @return {Object} empty cacheObject
   */
  clearAll() {
    this.cacheObject = {};
    return this.cacheObject;
  }
};
