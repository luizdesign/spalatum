const hrefAttributeIdentifier = new RegExp(/href="([^"]+)"/, 'm');
const proxyAttributeIdentifier = new RegExp(/proxy="([^"]+)"/, 'm');

/**
 * Extract the value of attribute
 * @param  {String} fragment   [The fragment tag]
 * @param  {RegExp} identifier [Object RegExp need to identifier the attribute]
 * @return {Object}
 */
const getFragmentAttributeValeuByName = (fragment, identifier) => {
  const match = fragment.match(identifier);

  return match ? match[1] : match;
};

/**
 * Extract the fragment Attributes
 * @param  {String} fragment [The fragment tag]
 * @return {Object}
 */
const getFragmentAttributes = (fragment) => {
  const href = getFragmentAttributeValeuByName(fragment, hrefAttributeIdentifier);
  const proxy = getFragmentAttributeValeuByName(fragment, proxyAttributeIdentifier);

  return {
    href,
    proxy,
  };
};

module.exports = getFragmentAttributes;
