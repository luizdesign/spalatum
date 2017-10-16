const Spalatum = require('../../lib/index.js');
const PrimaryFragmentException = require('../../lib/exceptions/primaryFragmentException.js');

const mockPath = '../../__mocks__';

beforeEach(() => {
  document.body.outerHTML = null;
});

describe('# Testing a request to a https fragment', () => {
  it('Calling spalatum with https fragments', async () => {
    const httpsTemplate = require(`${mockPath}/https-template.js`);
    const renderedHttpsTemplate = await Spalatum.render(httpsTemplate);

    document.body.outerHTML = renderedHttpsTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
  });
});

describe('# Testing a request to a fragment that throws an error', () => {
  it('Calling spalatum with a fragment that status code returns a 404, I expect that returns fragments rendered in blank', async () => {
    const template = require(`${mockPath}/notfound-template.js`);
    const renderedTemplate = await Spalatum.render(template);

    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
  });

  it('Calling spalatum with a fragment with primary attribute that status code returns a 404, I expect that returns an error object', () => {
    const template = require(`${mockPath}/notfound-primary-template.js`);

    expect(Spalatum.render(template)).rejects.toEqual(
      new PrimaryFragmentException(
        'Spalatum can\'t render the primary fragment (https://httpbin.org/notfound/), the returned statusCode was 404.',
      ),
    );
  });
});
