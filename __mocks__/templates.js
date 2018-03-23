const str = fragmentTags => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <title>Unit Test</title>
  </head>
  <body>
    ${fragmentTags}
  </body>
</html>`;

const builder = (...fragments) => {
  const fragmentTags = fragments.map((f) => {
    if ((typeof f) === 'string') {
      return `<fragment href="${f}"/>`;
    }

    return `<fragment
      href="${f.href}"
      ${f.primary ? 'primary' : ''}
      ${f.cache ? `cache="${f.cache}"` : ''}
      ${f.proxy ? `proxy="${f.proxy}"` : ''}/>`;
  });

  return str(fragmentTags.join('\n'));
};

const primary = true;
const cache = '10m';
const proxy = 'http://localhost:5000/';
const href = 'http://localhost:8000/';

module.exports = {
  clean: builder(),
  simple: builder(href),
  https: builder('https://httpbin.org/html'),
  error: builder('http://localhost:1000/'),
  notFound: builder('https://httpbin.org/notfound/'),
  primary: builder(
    { href, primary },
  ),
  proxy: builder(
    { href: 'http://localhost:7000/', proxy },
  ),
  singleCache: builder(
    { href: 'http://localhost:9000/', cache },
  ),
  cache: builder(
    { href: 'http://localhost:9000/', cache },
    { href: 'http://localhost:9001/', cache },
  ),
  notFoundPrimary: builder(
    { href: 'https://httpbin.org/notfound/', primary },
    { href: 'https://httpbin.org/' },
  ),
  twoPrimary: builder(
    { href, primary },
    { href, primary },
  ),
};
