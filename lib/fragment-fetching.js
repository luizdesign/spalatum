const superagent = require('superagent');

require('superagent-proxy')(superagent);

/**
 * Returns the fragment request promise
 *
 * @param  {Object} fragmentAttributes [fragment tag attributes]
 * @return {Promise}
 */
const fragmentFetching = async (fragmentAttributes) => {
  const request = superagent.get(fragmentAttributes.href);

  if (fragmentAttributes.proxy) {
    request.proxy(fragmentAttributes.proxy);
  }

  const response = await request;
  return response.text;
};

module.exports = fragmentFetching;
