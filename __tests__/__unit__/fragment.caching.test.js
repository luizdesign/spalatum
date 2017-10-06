const moment = require('moment');
const cachingModule = require('../../lib/fragment-caching');
const responseMock = require('../../__mocks__/response');
const encryption = require('../../lib/encryption');

const mockResponseSmaller50 = 'unit test unit test unit test unit test unit test';
const mockResponseGreather50 = `${mockResponseSmaller50} test unit test`;
const mockContentType = 'text/html';

beforeEach(() => {
  global.cache = {};
});

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
      const mock = responseMock(200, mockResponseGreather50, 'text/html');

      expect(cachingModule.canSaveCache('10s', mock))
        .toEqual(true);
    });
  });

  describe('# Testing the listCache method', () => {
    it('Calling before store any cache. I expect that it returns an empty list', () => {
      const result = cachingModule.listCache();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toEqual(0);
    });

    it('Calling after store some cache items. I expect that it returns an list with related urls and ages.', () => {
      const cacheItens = [{
        href: 'www.foo.com.br',
        maxAge: '10m',
      }, {
        href: 'www.bar.com.br',
        maxAge: '10m',
      }];

      cacheItens.forEach(item =>
        cachingModule.save(
          item.href,
          item.maxAge,
          mockResponseGreather50),
      );

      const cacheListResult = cachingModule.listCache();
      const expectedTimestamp = moment().add(10, 'm').format();

      expect(cacheListResult.length)
        .toEqual(cacheItens.length);

      cacheListResult
        .forEach(
          (cacheResultItem, index) => {
            const cacheKey = encryption.generateMd5(cacheItens[index].href);

            expect(cacheResultItem.key).toEqual(cacheKey);
            expect(cacheResultItem.content).toEqual(cache[cacheKey].content);
            expect(cacheResultItem.timestamp).toEqual(expectedTimestamp);
          },
        );
    });
  });
});
