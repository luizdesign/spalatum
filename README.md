# Spalatum
**[Help us to choose one name to this lib](http://gitlab.devel/frontend-platform/spalatum/issues/2)**

Spalatum is a library that provides a middleware which you can integrate into any Node.js. This project is based on [Tailor](https://github.com/zalando/tailor).

Some of Spalatum features and benefits:

* **Composes pre-rendered markup on the backend**. This is important for SEO and fastens the initial render.
* **Enforces performance budget**. This is quite challenging otherwise, because there is no single point where you can control performance.

## Fragment

We understand "Fragment" as every endpoint hosted on http(s) server that provide the content you want to include in your page. If you want to use some specific js ou css, you can use the `Link` tag in your header or footer page to provide this resources. Check our **[example app using *Spalatum*](http://gitlab.devel/frontend-platform/spalatum-app-skeleton)** for the skeleton implementation.

### Fragment Tag
You can represent a Fragment using  the `<fragment />` tag with this attributes: href, proxy, cache.

#### href *(needed)*
Represent the endpoint that provide the content you want to include in your page.

This endpoint must returns `200` as status code and `text/html` as content-type. Otherwise it will not be rendered.

Example:
```
<fragment href="http://example.fragment.com/" />
```
#### proxy *(optional)*
If your *href* need to be accessed via proxy, use the complete proxy url as *PROTOCOL*://*HOST*:*PORT*

Example:
```
<fragment href="http://example.fragment.com/" proxy="https://127.0.0.1:8081" />
```

#### cache *(optional)*
The presence of **cache** attribute is optional, if you use, the fragment will be cached as you specify, if you don't, the fragment will be requested each time the page is loaded.

*Spalatum* represent cache lifetime as *[Momentjs](http://momentjs.com/docs/)* does.

Example:

| Time	| Cache attribute |
|-----|:-----------|
| no cache	| don't use the cache attribute |
| 10 years	| 10y |
| 3 quarters | 	3Q |
| 6 months | 	6M |
| 2 weeks | 	2w |
| 7 days | 	7d |
| 5 hours | 	5h |
| 12 minutes | 	12m |
| 3 seconds | 	3s |
| 5000 milliseconds | 	5000ms |

So, if you need to cache some fragment, you can use the *cache* attribute to represent how many time you want to cache.

Example:

#### Caching the fragment for 10 minutes:
```
<fragment href="http://example.fragment.com/" cache="10m" />
```

#### Caching the fragment for 10 days:
```
<fragment href="http://example.fragment.com/" cache="10d" />
```

#### No Cache:
If you don't want to use cache, just ommit the attribute:
```
<fragment href="http://example.fragment.com/" />
```

If you want to know how this cache works "under the hood", see the [cache diagram](https://drive.google.com/file/d/0B4FRF2kGUDbcTTlrbFNsZnNCZW8/view) for more details.

---

## Instalation
To install *Spalatum*, use the command below:
```sh
# You can use yarn, as well
npm install @cathodevel/spalatum
```

## Getting Started
To get started, you can create your own app using `"@cathodevel/spalatum": "^VERSION"` as dependencie in your `package.json`; or clone the **[app skeleton using nodejs and *Spalatum* (RECOMENDED)](http://gitlab.devel/frontend-platform/spalatum-app-skeleton)** that we provide.

### Example
Given you have this template:
```html
<html>
  <body>
    <fragment href="http://example.fragment.com/" />
  </body>
</html>
```
And the route http://example.fragment.com/ responds with:
```html
<header>
  <h1>This is a Fragment</h1>
</header>
```
Spalatum will return:
```html
<html>
  <body>
    <header>
      <h1>This is a Fragment</h1>
    </header>
  </body>
</html>
```

It's possible to set a proxy server as a fragment attribute, if needed:
```html
  <!-- Note that it's required to set the protocol (`http(s)`) in the proxy url attribute -->
  <fragment href="http://example.fragment.com/" proxy="http://example.proxyserver.com" />
```

You can set how many time you want to cache some fragment attribute using proxy too:
```html
  <!-- Note that it's required to set the protocol (`http(s)`) in the proxy url attribute -->
  <fragment href="http://example.fragment.com/" proxy="http://example.proxyserver.com" cache="1d" />
```

You can use multiple fragments together to assembly a web application:
```html
<html>
  <body>
    <fragment href="http://header.fragment.com/" cache="1w" />
    <div>Main Localy Rendered App</div>
    <fragment href="http://banner.fragment.com/" proxy="http://proxyserver.com" />
    <fragment href="http://footer.fragment.com/" cache="1w" />
  </body>
</html>
```

This nodejs example call the Spalatum function, passing to it a template string and get the return value as a Promise instance, which will be resolved with the parsed html:
```javascript
const Spalatum = require('@cathodevel/spalatum');
const express = require('express');

const app = express();

app.get('/', async (req, res) => {
  const template = `
    <html>
      <body>
        <fragment href="www.catho.com.br" />
      </body>
    </html>
  `;

  const templateResult = await Spalatum(template);
  res.send(templateResult);
});

app.listen(3000);
```

## Contributing

- Check the [issues](http://gitlab.devel/frontend-platform/spalatum/issues) to ensure that there is not someone already working on it
- Check our [contribution guide](http://gitlab.devel/frontend-platform/spalatum/blob/master/CONTRIBUTING.MD)

### Technical prerequisites
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/)

Clone this repository:
```sh
git clone http://gitlab.devel/frontend-platform/spalatum
```

Access the folder and install the project's dependencies:
```sh
cd spalatum && npm install
```

Before send a pull request, always runs the unit tests:
```sh
npm test
# or
npm run coverage
```
