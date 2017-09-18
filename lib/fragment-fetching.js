const fragmentCache = require('./fragment-caching');
const superagent = require('superagent');
const logger = require('./logger.js');

require('superagent-proxy')(superagent);

/**
 * Returns the fragment request promise
 *
 * @param  {Object} fragmentAttributes [fragment tag attributes]
 * @return {Promise}
 */
const fragmentFetching = async (fragmentAttributes) => {
  if (fragmentAttributes.cache) {
    const isCached = fragmentCache.isCached(
      fragmentAttributes.href,
    );

    if (isCached) {
      return fragmentCache.get(fragmentAttributes.href).content;
    }
  }

  const request = superagent.get(fragmentAttributes.href);
  if (fragmentAttributes.proxy) {
    request.proxy(fragmentAttributes.proxy);
  }

  let response = {};
  try {
    response = await request;

    if (response.status !== 200) {
      throw new Error();
    }
  } catch (error) {
    logger.error(error, `Error on request the fragment ${fragmentAttributes.href}`);
    response.text = '';
  }

  const fragmentContent = response.text;
  const canSaveCache = fragmentCache.canSaveCache(
    fragmentAttributes.cache,
    response,
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
