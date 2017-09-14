const transform = require('./transform');
const encryption = require('./encryption');
const fragmentCacheExpiring = require('./fragment-cache-expiring');

/**
 * Http status code accepted to generate cache
 * @type {Number}
 */
const AcceptStatusCode = 200;

/**
 * Content type accepted to generate cache
 * @type {String}
 */
const AcceptContentType = 'text/html';

/**
 * Minimum content size accepted to generate cache
 * @type {Number}
 */
const AcceptMinContentLenght = 50;

/**
 * Validate the response object
 * @param  {Object} responseObject [response object]
 * @return {Boolean}
 */
const validateRequest = responseObject =>
  responseObject.status === AcceptStatusCode
    && responseObject.type === AcceptContentType
    && responseObject.text.length >= AcceptMinContentLenght;

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
    validateRequest(responseObject) && maxAge !== null,
};

module.exports = FragmentCache;
