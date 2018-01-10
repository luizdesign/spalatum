const { URL } = require('url');
const superagent = require('./request-client');
const Cache = require('./Cache');
const { spalatumLogger, logRequestFormat } = require('./logger');
const requestValidation = require('./request-validation');

// Exceptions
const ContentTypeException = require('./exceptions/contentTypeException');
const PrimaryFragmentException = require('./exceptions/primaryFragmentException');
const ResponseException = require('./exceptions/responseException');

const cacheInstance = new Cache();

/**
 * Returns the fragment request promise
 *
 * @param  {Object} fragmentAttributes [fragment tag attributes]
 * @return {Promise}
 */
const fragmentFetching = async (fragmentAttributes) => {
  if (fragmentAttributes.cache) {
    const isCached = cacheInstance.isCached(
      fragmentAttributes.href,
    );

    if (isCached) {
      return cacheInstance.getItem(fragmentAttributes.href).content;
    }
  }

  const startTime = new Date().getTime();
  const request = superagent
    .get(fragmentAttributes.href)
    .set('user-agent', process.env.npm_package_name);

  request.ok(res => res.status);

  if (fragmentAttributes.proxy) {
    request.proxy(fragmentAttributes.proxy);
  }

  let response = {};
  try {
    response = await request;

    spalatumLogger.info(logRequestFormat(request, response, startTime), 'Request made by spalatum');

    if (!requestValidation.validateField('text/html', response.type)) {
      throw new ContentTypeException();
    }

    if (!requestValidation.validateField(200, response.status)) {
      throw new ResponseException();
    }
  } catch (error) {
    spalatumLogger.error(error, `Error on request the fragment ${fragmentAttributes.href}`);
    response.text = '';
  }

  const fragmentContent = response.text;

  if (fragmentAttributes.primary && response.status !== 200) {
    const errorMessage = `Spalatum can't render the primary fragment (${fragmentAttributes.href}), the returned statusCode was ${response.status}.`;

    spalatumLogger.error(errorMessage);
    throw new PrimaryFragmentException(errorMessage, response.status);
  }

  const canSaveCache = Cache.canSave(
    fragmentAttributes.cache,
    response,
  );
  if (canSaveCache) {
    cacheInstance.save(
      fragmentAttributes.href,
      fragmentAttributes.cache,
      fragmentContent,
    );
  }

  return fragmentContent;
};

module.exports = fragmentFetching;
