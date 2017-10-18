const templateStr = fragmentTags => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Unit Test</title>
  </head>
  <body>
    ${fragmentTags.join('\n\t')}
  </body>
</html>`;

const templateBuilder = (...fragments) => {
  const fragmentTags = fragments.map((f) => {
    if ((typeof f) === 'string') {
      return `<fragment href="${f}" />`;
    }

    return `<fragment href="${f.href}"
      ${f.primary ? 'primary' : ''}
      ${f.cache ? `cache="${f.cache}"` : ''}
      ${f.proxy ? `proxy="${f.proxy}"` : ''}
    />`;
  });

  return templateStr(fragmentTags);
};

const primary = true;
const cache = '10m';
const proxy = 'http://localhost:5000/';
const href = 'http://localhost:8000/';

module.exports = {
  clean: templateBuilder(),
  simple: templateBuilder(href),
  https: templateBuilder('https://httpbin.org/html'),
  error: templateBuilder('http://localhost:1000/'),
  notFound: templateBuilder('https://httpbin.org/notfound/'),
  primary: templateBuilder(
    { href, primary },
  ),
  proxy: templateBuilder(
    { href: 'http://localhost:7000/', proxy },
  ),
  singleCache: templateBuilder(
    { href: 'http://localhost:9000/', cache },
  ),
  cache: templateBuilder(
    { href: 'http://localhost:9000/', cache },
    { href: 'http://localhost:9001/', cache },
  ),
  notFoundPrimary: templateBuilder(
    { href: 'https://httpbin.org/notfound/', primary },
    { href: 'https://httpbin.org/' },
  ),
  twoPrimary: templateBuilder(
    { href, primary },
    { href, primary },
  ),
};
