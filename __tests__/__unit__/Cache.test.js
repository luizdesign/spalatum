const Cache = require('../../lib/Cache');
const responseMock = require('../../__mocks__/response');

const mockResponseSmaller50 = 'unit test unit test unit test unit test unit test';
const mockResponseGreather50 = `${mockResponseSmaller50} test unit test`;
const mockContentType = 'text/html';

describe('# Testing the fragment-caching module', () => {
  describe('# CanSaveCache method', () => {
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
});
