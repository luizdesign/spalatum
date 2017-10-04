const transform = require('./transform');
const encryption = require('./encryption');
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
 * Get the cache key based on original key
 * @param  {String} key [Original key]
 * @return {String}     [Hash md5]
 */
const getCacheKey = key => encryption.generateMd5(key);

/**
 * FragmentCache Object with public methods
 * @type {Object}
 */
const FragmentCache = {
  /**
   * Create or Update the key in cache with the content
   * @param  {String} key     [Original Key to organizing the cache object]
   * @param  {String} maxAge  [Cache max age]
   * @param  {String} content [Content to save in cache]
   * @return {Undefined}
   */
  save: (key, maxAge, content) => {
    if (!FragmentCache.isCached(key)) {
      cache[getCacheKey(key)] = {
        content: transform.toBase64(content),
        timestamp: fragmentCacheExpiring.getExpireTime(maxAge),
      };
    }
  },
    /**
     * Recover the cache value stored as key ion cache
     * @param  {String} key [Original key]
     * @return {String}
     */
  get: (key) => {
    const cacheValue = JSON.parse(
      JSON.stringify(cache[getCacheKey(key)]),
    );
    cacheValue.content = transform.toStringFromBase64(cacheValue.content);

    return cacheValue;
  },
  /**
   * Validate if exists cache for this key
   * @param  {String} key [Original Key]
   * @return {Boolean}
   */
  isCached: key =>
    cache[getCacheKey(key)] !== undefined
      && !fragmentCacheExpiring.validadeCacheExpire(
        FragmentCache.get(key).timestamp,
      ),
  /**
   * Validate if can save the cache object
   * @param  {String|Null} maxAge    [Max age for the cache]
   * @param  {Object} responseObject [Response object]
   * @return {Boolean}
   */
  canSaveCache: (maxAge, responseObject) =>
    requestValidation.validateRequest(validateObject, responseObject) && maxAge !== null,
  /**
   * Get the chache list
   * @return {Array}
   */
  listCache: () => Object.keys(cache).map((key) => {
    const item = cache[key];

    return {
      href: item.content,
      timestamp: item.timestamp,
    };
  }),
};

module.exports = FragmentCache;
