const superagent = require('superagent');
const fragmentCache = require('./fragment-caching');
const logger = require('./logger');
const requestValidation = require('./request-validation');

// Exceptions
const ContentTypeException = require('./exceptions/contentTypeException');
const PrimaryFragmentException = require('./exceptions/primaryFragmentException');
const ResponseException = require('./exceptions/responseException');

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
  request.ok(res => res.status);

  if (fragmentAttributes.proxy) {
    request.proxy(fragmentAttributes.proxy);
  }

  let response = {};
  try {
    response = await request;

    if (!requestValidation.validateField('text/html', response.type)) {
      throw new ContentTypeException();
    }

    if (!requestValidation.validateField(200, response.status)) {
      throw new ResponseException();
    }
  } catch (error) {
    logger.error(error, `Error on request the fragment ${fragmentAttributes.href}`);
    response.text = '';
  }

  const fragmentContent = response.text;

  if (fragmentAttributes.primary && response.status !== 200) {
    const errorMessage = `Spalatum can't render the primary fragment (${fragmentAttributes.href}), the returned statusCode was ${response.status}.`;

    logger.error(errorMessage);
    throw new PrimaryFragmentException(errorMessage, response.status);
  }

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
