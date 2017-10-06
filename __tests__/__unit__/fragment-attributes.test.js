const { getFragmentAttributes } = require('../../lib/fragment-attributes');

describe('# Testing the fragment-attributes module', () => {
  it('Calling the module with <fragment href="localhost:3000" proxy="localhost:2000" />, I expect that returns an object with the atrributes href and proxy', () => {
    expect(getFragmentAttributes('<fragment href="localhost:3000" proxy="localhost:2000" />'))
      .toEqual({
        cache: null,
        href: 'localhost:3000',
        primary: false,
        proxy: 'localhost:2000',
      });
  });

  it('Calling the module with <fragment href="localhost:3000" />, I expect that returns an object with the atrributes href and proxy but proxy equal to null', () => {
    expect(getFragmentAttributes('<fragment href="localhost:3000" />'))
      .toEqual({
        cache: null,
        href: 'localhost:3000',
        primary: false,
        proxy: null,
      });
  });

  it('Calling the module with <fragment href="localhost:3000" cache="10s" />, I expect that returns an object with the atrributes href and proxy but proxy equal to null', () => {
    expect(getFragmentAttributes('<fragment href="localhost:3000" cache="10s" />'))
      .toEqual({
        cache: '10s',
        href: 'localhost:3000',
        primary: false,
        proxy: null,
      });
  });

  it('Calling the module with <fragment href="localhost:3000" proxy="" />, I expect that returns an object with the atrributes href and proxy but proxy empty', () => {
    expect(getFragmentAttributes('<fragment href="localhost:3000" proxy="" />'))
      .toEqual({
        cache: null,
        href: 'localhost:3000',
        primary: false,
        proxy: null,
      });
  });

  it('Calling the module with <fragment href="localhost:3000" primary />, I expect that returns an object with the atrributes href and primary equal true', () => {
    expect(getFragmentAttributes('<fragment href="localhost:3000" primary />'))
      .toEqual({
        cache: null,
        href: 'localhost:3000',
        primary: true,
        proxy: null,
      });
  });

  it('Calling the module with multline fragment, I expect that returns an object with the atrributes href and proxy but proxy empty', () => {
    const fragment = `<fragment href="localhost:3000"
      proxy="localhost:2000"
    />`;
    expect(getFragmentAttributes(fragment))
      .toEqual({
        cache: null,
        href: 'localhost:3000',
        primary: false,
        proxy: 'localhost:2000',
      });
  });
});
