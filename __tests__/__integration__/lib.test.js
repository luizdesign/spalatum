const spalatum = require('../../lib/index.js');
const mockPath = '../../__mocks__';

beforeEach(() => {
  document.body.outerHTML = null;
});

describe('# Testing a request to a https fragment', () => {
  it('Calling spalatum with https fragments', async () => {
    const httpsTemplate = require(`${mockPath}/https-template.js`);
    const renderedHttpsTemplate = await spalatum(httpsTemplate);

    document.body.outerHTML = renderedHttpsTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
  });
});

describe('# Testing a request to a fragment that throws an error', () => {
  it('Calling spalatum with a fragment that status code returns a 404, I expect that returns fragments rendered in blank', async () => {
    const template = require(`${mockPath}/notfound-template.js`);
    const renderedTemplate = await spalatum(template);

    document.body.outerHTML = renderedTemplate;
    expect(document.body.outerHTML).toMatchSnapshot();
  });

  it('Calling spalatum with a fragment with primary attribute that status code returns a 404, I expect that returns an error object', async () => {
    const template = require(`${mockPath}/notfound-primary-template.js`);
    const renderedTemplate = await spalatum(template);

    expect(renderedTemplate.message).toEqual(`Spalatum can't render the primary fragment (https://httpbin.org/notfound/), the returned statusCode was 404.`);
    expect(renderedTemplate.statusCode).toEqual(404);
  });
});
