const moment = require('moment');

/**
 * Parse the max age to time and unit
 * @param  {String} maxAge [Max age of the cache key]
 * @return {Object}
 */
const maxAgeParser = (maxAge) => {
  const maxAgeUnit = maxAge.split(/\d+/)[1];
  const maxAgeTime = maxAge.split(/\D/)[0];

  return {
    time: maxAgeTime,
    unit: maxAgeUnit,
  };
};

/**
 * Get the timestamp of the max age
 * @param  {String} maxAge [Max age of the cache key]
 * @return {Timestamp}
 */
const getMaxAgeTimestamp = (maxAge) => {
  const maxAgeObject = maxAgeParser(maxAge);

  return moment().add(maxAgeObject.time, maxAgeObject.unit);
};

/**
 * CacheExpire object with the public methods
 * This lib use momentJs (see more docs in http://momentjs.com/docs)
 * @type {Object}
 */
const CacheExpire = {
  /**
   * Get cache expire time
   * @param  {String} maxAge [Cache max age]
   * @return {String}
   */
  getExpireTime: maxAge => getMaxAgeTimestamp(maxAge).format(),
  /**
   * Validate cache outdated
   * @param  {Timestamp} cacheMaxAge [Cache key max age]
   * @return {Boolean}
   */
  validadeCacheExpire: cacheMaxAge => moment().format() >= cacheMaxAge,
};

module.exports = CacheExpire;
