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

module.exports = {
  clean: templateBuilder(),
  simple: templateBuilder('http://localhost:8000/'),
  https: templateBuilder('https://httpbin.org/html'),
  error: templateBuilder('http://localhost:1000/'),
  notFound: templateBuilder('https://httpbin.org/notfound/'),
  primary: templateBuilder(
    { href: 'http://localhost:8000/', primary: true },
  ),
  singleCache: templateBuilder(
    { href: 'http://localhost:9000/', cache: '10m' },
  ),
  proxy: templateBuilder(
    { href: 'http://localhost:7000/', proxy: 'http://localhost:5000/' },
  ),
  notFoundPrimary: templateBuilder(
    { href: 'https://httpbin.org/notfound/', primary: true },
    { href: 'https://httpbin.org/' },
  ),
  twoPrimary: templateBuilder(
    { href: 'http://localhost:8000/', primary: true },
    { href: 'http://localhost:8000/', primary: true },
  ),
  cache: templateBuilder(
    { href: 'http://localhost:9000/', cache: '10m' },
    { href: 'http://localhost:9001/', cache: '10m' },
  ),
};
