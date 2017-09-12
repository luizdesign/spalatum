const moment = require('moment');

/**
 * Parse the max age to time and unit
 * @param  {String} maxAge [Max age of the cache key]
 * @return {Object}
 */
const maxAgeParser = (maxAge) => {
  const maxAgeTime = maxAge.split(/\d+/);

  return {
    time: maxAgeTime[0],
    unit: maxAgeTime[1],
  };
};

/**
 * Get the timestamp of the max age
 * @param  {String} maxAge [Max age of the cache key]
 * @return {Timestamp}
 */
const getMaxAgeTimestamp = (maxAge) => {
  const maxAgeTime = maxAgeParser(maxAge);

  return moment().subtract(maxAgeTime.time, maxAgeTime.unit);
};

/**
 * CacheExpire object with the public methods
 * This lib use momentJs (see more docs in http://momentjs.com/docs)
 * @type {Object}
 */
const CacheExpire = {
  /**
   * Validate if this key is outdated
   * @param  {Stirng} key    [Original Cache key]
   * @param  {String} maxAge [Max Age to this cache key]
   * @param  {Timestamp} cacheTime [Cache key generated timestamp]
   * @return {Boolean}
   */
  validadeCacheExpire: (key, maxAge, cacheTime) => {
    // console.log(key, maxAge, cacheTime);
    const maxAgeTime = getMaxAgeTimestamp(maxAge);

    return moment(cacheTime).isAfter(maxAgeTime);
  },
};

module.exports = CacheExpire;
