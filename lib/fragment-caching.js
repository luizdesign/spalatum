const transform = require('./transform');
const encryption = require('./encryption');

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
   * @param  {String} content [Content to save in cache]
   * @return {Undefined}
   */
  save: (key, content) => {
    cache[getCacheKey(key)] = transform.toBase64(content);
  },
    /**
     * Recover the cache value stored as key ion cache
     * @param  {String} key [Original key]
     * @return {String}
     */
  get: key => transform.toStringFromBase64(cache[getCacheKey(key)]),
  /**
   * Validate if exists cache for this key
   * @param  {String} key [Original Key]
   * @return {Boolean}
   */
  isCached: key => cache[getCacheKey(key)],
};

module.exports = FragmentCache;
