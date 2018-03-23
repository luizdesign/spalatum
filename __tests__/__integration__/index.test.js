// Lib components
const spalatum = require('../../lib/index.js');

// Mock utils
const templates = require('../../__mocks__/templates');

// Environment
const originalEnv = process.env.NODE_ENV;

beforeEach(() => {
  // Clear testing data
  document.body.outerHTML = null;

  // Reseting Env
  process.env.NODE_ENV = originalEnv;
});

describe('# Testing a request to a https fragment', () => {
  it('Calling spalatum with https fragments', async () => {
    document.body.outerHTML = await spalatum.render(templates.https, {});
    expect(document.body.outerHTML).toMatchSnapshot();
  });
});

describe('# Testing a request to a fragment that throws an error', () => {
  it('Calling spalatum from development with a fragment that status code returns a 404, I expect that throw an error', async () => {
    process.env.NODE_ENV = 'development';

    const spalatumResponse = await spalatum.render(templates.notFound, {});

    expect(spalatumResponse.includes('Spalatum failed to render')).toBe(true);
  });

  it('Calling spalatum from production with a fragment that status code returns a 404, I expect that returns fragments rendered in blank', async () => {
    process.env.NODE_ENV = 'production';

    const spalatumResponse = await spalatum.render(templates.notFound, {});

    expect(spalatumResponse.replace(/\s*/g, '').includes('<body></body>')).toBe(true);
  });

  it('Calling Spalatum from production with a template with primary attribute, when the fragment request status code returns 404, I expect that throw an error', async () => {
    process.env.NODE_ENV = 'production';

    try {
      await spalatum.render(templates.notFoundPrimary, {});
    } catch (error) {
      expect(error.message).toMatch('Spalatum can\'t render the primary fragment (https://httpbin.org/notfound/), the returned statusCode was 404.');
    }
  });

  it('Calling Spalatum from development with a template with primary attribute, when the fragment request status code returns 404, I expect that throw an error', async () => {
    process.env.NODE_ENV = 'development';

    const spalatumResponse = await spalatum.render(templates.notFoundPrimary, {});
    expect(spalatumResponse.includes('Spalatum failed to render')).toBe(true);
  });
});
