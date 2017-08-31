const fragmentMapping = require('./fragment-mapping');
const fragmentRender = require('./fragment-render');

module.exports = template => fragmentMapping(template)
  // There are fragments
  .then(mapping => fragmentRender(template, mapping))
  // There is no fragment
  .catch(originalTemplate => originalTemplate);
