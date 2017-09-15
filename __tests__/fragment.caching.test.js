const cachingModule = require('../lib/fragment-caching');
const responseMock = require('../__mocks__/response');

let mockResponseSmaller50 = 'unit test unit test unit test unit test unit test';
let mockResponseGreather50 = `${mockResponseSmaller50} test unit test`;
let mockContentType = 'text/html';

describe('# Testing the fragment-caching module', () => {
  describe('# Testing the canSaveCache method', () => {
    it('Calling the module with max age null, I expect that returns false', () => {
      expect(cachingModule.canSaveCache(null, {}))
        .toEqual(false);
    });
    it('Calling the module with max age different of null and httpRequest different of 200, I expect that returns false', () => {
      let mock = responseMock(301, mockResponseGreather50, mockContentType);
      expect(cachingModule.canSaveCache('10s', mock))
        .toEqual(false);

      mock = responseMock(404, mockResponseGreather50, mockContentType);
      expect(cachingModule.canSaveCache('10s', mock))
        .toEqual(false);

      mock = responseMock(500, mockResponseGreather50, mockContentType);
      expect(cachingModule.canSaveCache('10s', mock))
        .toEqual(false);
    });

    it('Calling the module with max age different of null, httpRequest equal to 200 and content size smaller than 200, I expect that returns false', () => {
      let mock = responseMock(200, '', mockContentType);
      expect(cachingModule.canSaveCache('10s', mock))
        .toEqual(false);

      mock = responseMock(200, mockResponseSmaller50, mockContentType);
      expect(cachingModule.canSaveCache('10s', mock))
        .toEqual(false);
    });

    it('Calling the module with max age different of null, httpRequest equal to 200, content size greather than 200 and content-type different of text/html, I expect that returns false', () => {
      let mock = responseMock(200, mockResponseGreather50, 'application/json');
      expect(cachingModule.canSaveCache('10s', mock))
        .toEqual(false);

      mock = responseMock(200, mockResponseGreather50, 'text/css');
      expect(cachingModule.canSaveCache('10s', mock))
        .toEqual(false);
    });

    it('Calling the module with max age different of null, httpRequest equal to 200, content size greather than 200 and content-type equal to text/html, I expect that returns true', () => {
      let mock = responseMock(200, mockResponseGreather50, 'text/html');

      expect(cachingModule.canSaveCache('10s', mock))
        .toEqual(true);
    });
  });
});
