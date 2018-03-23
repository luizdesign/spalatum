module.exports = {
  'extends': 'airbnb',
  'rules': {
    'no-await-in-loop': 0,
  },
  'env': {
    'mocha': true
  },
  'globals': {
    'cache': true,
    'expect': true,
    'document': true,
    'jest': true,
    'jasmine': true,
  }
};
