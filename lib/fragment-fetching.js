const fragmentCache = require('./fragment-caching');
const superagent = require('superagent');

require('superagent-proxy')(superagent);

/**
 * Returns the fragment request promise
 *
 * @param  {Object} fragmentAttributes [fragment tag attributes]
 * @return {Promise}
 */
const fragmentFetching = async (fragmentAttributes) => {
  if (fragmentAttributes.cache) {
    const isCached = fragmentCache.isCached(fragmentAttributes.href, fragmentAttributes.cache);

    if (isCached) {
      return fragmentCache.get(fragmentAttributes.href);
    }
  }

  const request = superagent.get(fragmentAttributes.href);
  if (fragmentAttributes.proxy) {
    request.proxy(fragmentAttributes.proxy);
  }

  const response = await request;
  const fragmentContent = response.text;
  const canSaveCache = fragmentCache.canSaveCache(
    fragmentAttributes.cache,
    response.status,
  );
  if (canSaveCache) {
    fragmentCache.save(
      fragmentAttributes.href,
      fragmentAttributes.cache,
      fragmentContent,
    );
  }

  return fragmentContent;
};

module.exports = fragmentFetching;
