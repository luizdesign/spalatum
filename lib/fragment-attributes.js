const hrefAttributeIdentifier = new RegExp(/href="([^"]+)"/);
const proxyAttributeIdentifier = new RegExp(/proxy="([^"]+)"/);

/**
 * Extract the value of attribute
 * @param  {String} fragment   [The fragment tag]
 * @param  {RegExp} identifier [Object RegExp need to identifier the attribute]
 * @return {Object}
 */
const getFragmentAttributeValeuByName = (fragment, identifier) => {
  const match = fragment.match(identifier);

  if (match) {
    return match[1];
  }

  return null;
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
