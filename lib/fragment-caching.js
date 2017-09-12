const moment = require('moment');
const transform = require('./transform');
const encryption = require('./encryption');
const fragmentCacheExpiring = require('./fragment-cache-expiring');

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
    if (!FragmentCache.isCached(key, maxAge)) {
      cache[getCacheKey(key)] = {
        content: transform.toBase64(content),
        timestamp: moment().format(),
      };
    }
  },
    /**
     * Recover the cache value stored as key ion cache
     * @param  {String} key [Original key]
     * @return {String}
     */
  get: key => transform.toStringFromBase64(cache[getCacheKey(key)].content),
  /**
   * Validate if exists cache for this key
   * @param  {String} key [Original Key]
   * @param  {String} maxAge [Cache max age]
   * @return {Boolean}
   */
  isCached: (key, maxAge) =>
    cache[getCacheKey(key)]
      && fragmentCacheExpiring.validadeCacheExpire(
        key,
        maxAge,
        FragmentCache.get(key).timestamp,
      ),
};

module.exports = FragmentCache;
