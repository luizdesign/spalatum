const superagent = require('superagent');
const Cache = require('./Cache');
const logger = require('./logger');
const requestValidation = require('./request-validation');

// Exceptions
const ContentTypeException = require('./exceptions/contentTypeException');
const PrimaryFragmentException = require('./exceptions/primaryFragmentException');
const ResponseException = require('./exceptions/responseException');

require('superagent-proxy')(superagent);

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

  let endTime;
  const startTime = new Date().getTime();
  const request = superagent.get(fragmentAttributes.href);

  request.ok(res => res.status);
  request.on('response', () => {
    endTime = new Date().getTime();
  });

  const format = (req, res) => ({
    'content-length': `${res.headers['content-length'] || '-'}`,
    'content-type': `${res.headers['content-type'] || '-'}`,
    date: `${res.headers.date || '-'}`,
    method: `${req.method || '-'}`,
    reqok: `${res.ok || '-'}`,
    'response-time': `${endTime - startTime || '-'}ms`,
    status: `${res.statusCode || '-'}`,
    'url-path': `${req.req.path || '-'}`,
    vhost: `${req.host || '-'}`,
  });

  if (fragmentAttributes.proxy) {
    request.proxy(fragmentAttributes.proxy);
  }

  let response = {};
  try {
    response = await request;

    if (request.req && response.headers) {
      logger.info(format(request, response), 'Request made by spalatum');
    }

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
