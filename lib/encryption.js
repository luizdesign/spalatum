const crypto = require('crypto');

/**
 * Secret key to help generate a safer hash
 * @type {String}
 */
const secret = 'fragment_render';

/**
 * Generate a new key based on the original
 * @param  {String} originalKey [Original key to generate the hash]
 * @return {String}
 */
const generateKey = originalKey => originalKey + secret;

/**
 * Encryption object with the public methods
 * @type {Object}
 */
const Encryption = {
  /**
   * Generates a md5 hash
   * @param  {String} value [Original key to generate the hash]
   * @return {String}
   */
  generateMd5: value => crypto
    .createHash('md5')
    .update(generateKey(value))
    .digest('hex'),
};

module.exports = Encryption;
