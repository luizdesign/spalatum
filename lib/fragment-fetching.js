const superagent = require('./request-client');
const Cache = require('./Cache');
const { spalatumLogger, logRequestFormat } = require('./logger');
const requestValidation = require('./request-validation');
const responseErrorTemplate = require('../templates/response-error');

// Exceptions
const ContentTypeException = require('./exceptions/contentTypeException');
const PrimaryFragmentException = require('./exceptions/primaryFragmentException');
const ResponseException = require('./exceptions/responseException');

const cacheInstance = new Cache();

/**
 * Returns the fragment request promise
 *
 * @param  {Object} fragmentAttributes [fragment tag attributes]
 * @param  {Object} options [request options]
 * @param  {Object} options.headers [headers to be set on fragment request]
 *
 * @return {Promise}
 */
const fragmentFetching = async (fragmentAttributes, { headers }) => {
  if (fragmentAttributes.cache) {
    const isCached = cacheInstance.isCached(fragmentAttributes.href);

    if (isCached) {
      return cacheInstance.getItem(fragmentAttributes.href).content;
    }
  }

  const startTime = new Date().getTime();
  const request = superagent
    .get(fragmentAttributes.href)
    .set('user-agent', process.env.npm_package_name);

  if (headers) {
    request.set(headers);
  }

  request.ok(res => res.status);

  if (fragmentAttributes.proxy) {
    request.proxy(fragmentAttributes.proxy);
  }

  let response = {};
  try {
    response = await request;

    spalatumLogger.info(logRequestFormat(request, response, startTime), 'Request made by spalatum');

    if (!requestValidation.validateStatusCode(response.status)) {
      throw new ResponseException({ statusCode: response.status });
    }

    if (!requestValidation.validateField('text/html', response.type)) {
      throw new ContentTypeException();
    }
  } catch (error) {
    spalatumLogger.error(error, `Error on request the fragment ${fragmentAttributes.href}`);

    if (process.env.NODE_ENV !== 'production') {
      response.text = responseErrorTemplate({
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
        fragment: fragmentAttributes.href,
        stack: error.stack,
      });

      throw response.text;
    }

    response.text = '';
  }

  const fragmentContent = response.text;

  if (fragmentAttributes.primary && !requestValidation.validateStatusCode(response.status) && (process.env.NODE_ENV === 'production')) {
    const errorMessage = `Spalatum can't render the primary fragment (${fragmentAttributes.href}), the returned statusCode was ${response.status}.`;

    spalatumLogger.error(errorMessage);
    throw new PrimaryFragmentException({
      message: errorMessage,
      statusCode: response.status,
      fragmentUrl: fragmentAttributes.href,
    });
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
