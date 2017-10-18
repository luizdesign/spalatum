const Cache = require('../../lib/Cache');
const responseMock = require('../../__mocks__/response');

const mockResponseSmaller50 = 'unit test unit test unit test unit test unit test';
const mockResponseGreather50 = `${mockResponseSmaller50} test unit test`;
const mockContentType = 'text/html';
const instance = new Cache();

describe('# Testing the fragment-caching module', () => {
  describe('# CanSaveCache static method', () => {
    const execTest = (mock, result) => expect(Cache.canSave('10s', mock)).toEqual(result);

    it('Calling the module with max age null, I expect that returns false', () => {
      expect(Cache.canSave(null, {})).toEqual(false);
    });

    it('Calling the module with max age different of null and httpRequest different of 200, I expect that returns false', () => {
      execTest(responseMock(301, mockResponseGreather50, mockContentType), false);
      execTest(responseMock(301, mockResponseGreather50, mockContentType), false);
      execTest(responseMock(500, mockResponseGreather50, mockContentType), false);
    });

    it('Calling the module with max age different of null, httpRequest equal to 200 and content size smaller than 200, I expect that returns false', () => {
      execTest(responseMock(200, '', mockContentType), false);
      execTest(responseMock(200, mockResponseSmaller50, mockContentType), false);
    });

    it('Calling the module with max age different of null, httpRequest equal to 200, content size greather than 200 and content-type different of text/html, I expect that returns false', () => {
      execTest(responseMock(200, mockResponseGreather50, 'application/json'), false);
      execTest(responseMock(200, mockResponseGreather50, 'text/css'), false);
    });

    it('Calling the module with max age different of null, httpRequest equal to 200, content size greather than 200 and content-type equal to text/html, I expect that returns true', () => {
      execTest(responseMock(200, mockResponseGreather50, 'text/html'), true);
    });
  });

  describe('# Save method', () => {
    const testValues = [{
      key: 'foo',
      content: 'foo content',
      maxAge: '10m',
    }, {
      key: 'bar',
      content: 'bar content',
      maxAge: '10m',
    }];

    beforeEach(() => {
      instance.clearAll();
    });

    it('Calling the method with an uncached value. I expect the value is cached', () => {
      const testItem = testValues[0];

      expect(instance.isCached(testItem.key)).toBeFalsy();
      expect(instance.getItem(testItem.key)).toBeNull();

      instance.save(testItem.key, testItem.maxAge, testItem.content);

      expect(instance.isCached(testItem.key)).toBeTruthy();
      expect(instance.getItem(testItem.key).content).toEqual(testItem.content);
    });

    it('Calling the method with an cached value. I expect the cache object have only one item', () => {
      const testItem = testValues[0];
      instance.save(testItem.key, testItem.maxAge, testItem.content);
      instance.save(testItem.key, testItem.maxAge, testItem.content);

      expect(Object.keys(instance.cacheObject).length).toBe(1);
    });
  });
});
