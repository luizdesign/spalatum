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
  })
})
