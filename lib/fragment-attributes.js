const hrefAttributeIdentifier = new RegExp(/href="([^"]+)"/, 'm');
const proxyAttributeIdentifier = new RegExp(/proxy="([^"]+)"/, 'm');
const cacheAttributeIdentifier = new RegExp(/cache="([^"]+)"/, 'm');
const primaryAttributeIdentifier = new RegExp(/primary/, 'm');

/**
 * Extract the value of attribute
 * @param  {String} fragment   [The fragment tag]
 * @param  {RegExp} identifier [Object RegExp need to identifier the attribute]
 * @return {Object}
 */
const getFragmentAttributeValueByName = (fragment, identifier) => {
  const match = fragment.match(identifier);

  return match ? match[1] : match;
};

/**
 * Extract the fragment Attributes
 * @param  {String} fragment [The fragment tag]
 * @return {Object}
 */
const getFragmentAttributes = (fragment) => {
  const href = getFragmentAttributeValueByName(fragment, hrefAttributeIdentifier);
  const proxy = getFragmentAttributeValueByName(fragment, proxyAttributeIdentifier);
  const cache = getFragmentAttributeValueByName(fragment, cacheAttributeIdentifier);
  const primary = primaryAttributeIdentifier.test(fragment);

  return {
    href,
    proxy,
    cache,
    primary,
  };
};

module.exports = getFragmentAttributes;
