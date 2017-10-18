const spalatum = require('../../lib/index.js');
const PrimaryFragmentException = require('../../lib/exceptions/primaryFragmentException.js');

// Templates
const notFoundTemplate = require('../../__mocks__/notfound-template.js');
const notFoundPrimaryTemplate = require('../../__mocks__/notfound-primary-template.js');
const httpsTemplate = require('../../__mocks__/https-template.js');

beforeEach(() => {
  document.body.outerHTML = null;
});

describe('# Testing a request to a https fragment', () => {
  it('Calling spalatum with https fragments', async () => {
    document.body.outerHTML = await spalatum.render(httpsTemplate);
    expect(document.body.outerHTML).toMatchSnapshot();
  });
});

describe('# Testing a request to a fragment that throws an error', () => {
  it('Calling spalatum with a fragment that status code returns a 404, I expect that returns fragments rendered in blank', async () => {
    document.body.outerHTML = await spalatum.render(notFoundTemplate);
    expect(document.body.outerHTML).toMatchSnapshot();
  });

  it('Calling spalatum with a fragment with primary attribute that status code returns a 404, I expect that returns an error object', () => {
    expect(spalatum.render(notFoundPrimaryTemplate)).rejects.toEqual(
      new PrimaryFragmentException(
        'Spalatum can\'t render the primary fragment (https://httpbin.org/notfound/), the returned statusCode was 404.',
      ),
    );
  });
});
