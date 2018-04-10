# Spalatum
[![Build Status](https://travis-ci.org/catho/spalatum.svg?branch=master)](https://travis-ci.org/catho/spalatum)
[![codecov](https://codecov.io/gh/catho/spalatum/branch/master/graph/badge.svg)](https://codecov.io/gh/catho/spalatum)
[![Dependencies status](https://david-dm.org/catho/spalatum/status.svg)](https://david-dm.org/catho/spalatum)
[![devDependencies status](https://david-dm.org/catho/spalatum/dev-status.svg)](https://david-dm.org/catho/spalatum?type=dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![GitHub license](https://img.shields.io/github/license/catho/spalatum.svg?maxAge=2592000)](https://github.com/catho/spalatum/blob/master/LICENSE)
[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg)](#contributors)

Spalatum is a library to merge different fragment sources into a single template. With Spalatum you can get multiple external fragments and serve all together in your html page. This project is based on [Tailor](https://github.com/zalando/tailor).

Some of Spalatum features and benefits:

* **Composes pre-rendered markup on the backend**. This is important for SEO and fastens the initial render.
* **Enforces performance budget**. This is quite challenging otherwise, because there is no single point where you can control performance.
* **Cache Management** - When you use `cache` attribute in `<fragment>` tag, your app performace will be improved. With spalatum's cache management  we give you the power to see what is cached, delete some specific endpoint or just purge all cached fragment.
* **Remove duplicated assets** - Spalatum avoid multiple requests for an external Javascript or CSS, preserving only the first. So, if you have 2 or more fragments importing the same JS/CSS lib, we will remove all duplicated call starting from the second.

## Before start

Before start, you must understand Fragment.

### Fragment

We understand "Fragment" as every endpoint hosted on http(s) server that provide the content you want to include in your page. If you want to use some specific js or css, you can use `script`, `style`, `Link` or any other tags in your template page to provide this resources. Check our **[example app using *Spalatum*](https://github.com/catho/spalatum-app-skeleton)** for the skeleton implementation.

#### Fragment Tag
You can represent a Fragment using  the `<fragment />` tag with this attributes: href, proxy, cache.

##### href *(needed)*
Represent the endpoint that provide the content you want to include in your page.

This endpoint must returns `200` as status code and `text/html` as content-type. Otherwise it will not be rendered.

Example:
```
<fragment href="http://example.fragment.com/" />
```

##### primary *(optional)*

Represents the main content. You can use only once primary attribute per template. If the request throws any error, will be returned an error object instead of the rendered html.

Example:
```
<fragment href="http://example.fragment.com/" primary />
```

Error object example:
```
{
    message: 'Spalatum can't render the primary fragment ({fragment.href}), the returned statusCode was {response.status}.',
    statusCode: 500
}
```
#### proxy *(optional)*
If your *href* need to be accessed via proxy, use the complete proxy url as *PROTOCOL*://*HOST*:*PORT*

Example:
```
<fragment href="http://example.fragment.com/" proxy="https://127.0.0.1:8081" />
```

##### cache *(optional)*
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

##### Caching the fragment for 10 minutes:
```
<fragment href="http://example.fragment.com/" cache="10m" />
```

##### Caching the fragment for 10 days:
```
<fragment href="http://example.fragment.com/" cache="10d" />
```

##### No Cache:
If you don't want to use cache, just ommit the attribute:
```
<fragment href="http://example.fragment.com/" />
```

If you want to know how this cache works "under the hood", see the [cache diagram](https://drive.google.com/file/d/0B4FRF2kGUDbcTTlrbFNsZnNCZW8/view) for more details.


---

## Instalation
Use the command below to add *Spalatum* as your project dependencie:
```sh
# You can use yarn, as well
npm install spalatum
```

## Getting Started
To get started, you can create your own app using `"spalatum": "^VERSION"` as dependencie in your `package.json`; or clone the **[app skeleton using nodejs and *Spalatum* (RECOMENDED)](https://github.com/catho/spalatum-app-skeleton)** that we provide.

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

This nodejs example create a Spalatum instance, setting to it a cache object, then call the render method passing to it a template string that returns a Promise instance, which will be resolved with the parsed html or reject in error case:
```javascript
const spalatum = require('spalatum');
const express = require('express');

const app = express();

app.get('/', async (req, res) => {
  const template = `
    <html>
      <body>
        <fragment href="https://github.com/catho/spalatum" />
      </body>
    </html>
  `;

  const templateResult = await spalatum.render(template);
  res.send(templateResult);
});

app.listen(3000);
```

Also, the render method accepts a custom header object, if you need to pass headers between all fragments.

```javascript
  ...

  const headers = {
    Cookies: 'foo=bar',
    'Content-type': 'text/html',
  }

  const templateResult = await spalatum.render(template, { headers });

  ...
```

## Caching

When you use the `fragment` tag and add a `cache` attribute, internally, the Spalatum create a `cache` object that store: href (as key), content, timestamp.

```
  cacheObject = {
    '[href]': {
      content: '[encrypted_fragment_content]',
      timestamp: '[cache_expiration_time]'
    }
  }
```

If you want, you can manage the cache inside your Spalatum instance.

### Cache Management

There are some methods that you can use to manage Spalatum cache: getCache, clearCacheItem, clearAllCache.

#### Spalatum.getCache
Returns the cache object.

```
  {
    'http://localhost:9000/': {
      content: 'aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kN2w5MWduV0EzSQ==',
      timestamp: '2017-10-10T15:10:33-03:00'
    },
    'http://localhost:9001/': {
      content: 'aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1KNXdmNlVNWkVZNA==',
      timestamp: '2017-10-10T15:10:33-03:00'
    }
  }
```

#### Spalatum.clearCacheItem(`endpoint`)
Remove a specific cache item by endpoint.

Given you have some `cache`:
```
  {
    'http://localhost:9000/': {
      ...
    },
    'http://localhost:9001/': {
      ...
    }
  }
```

When you call the method `Spalatum.clearCacheItem('http://localhost:9000/')`, this specified endpoint will be removed and the cache object will be:
```
  {
    'http://localhost:9001/': {
      ...
    }
  }
```

#### Spalatum.clearAllCache()

Remove all cache items from cacheObject.

Given you have this `cache`:
```
  {
    'http://localhost:9000/': {
      ...
    }
  }
```

When you call the method `Spalatum.clearAllCache()`, all cached endpoints will be removed and the cache object will be:

```
  {}
```

## Contributing

- Check the [issues](https://github.com/catho/spalatum/issues) to ensure that there is not someone already working on it
- Check our [contribution guide](https://github.com/catho/spalatum/blob/master/CONTRIBUTING.MD)

### Technical prerequisites
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/)

Clone this repository:
```sh
git clone https://github.com/catho/spalatum
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

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars1.githubusercontent.com/u/13424727?v=4" width="100px;"/><br /><sub><b>Allysson dos Santos</b></sub>](https://allysson.me/)<br />[💻](https://github.com/catho/Spalatum/commits?author=allyssonsantos "Code") [📖](https://github.com/catho/Spalatum/commits?author=allyssonsantos "Documentation") [👀](#review-allyssonsantos "Reviewed Pull Requests") | [<img src="https://avatars1.githubusercontent.com/u/755101?v=4" width="100px;"/><br /><sub><b>Daniel Silva</b></sub>](https://github.com/ddsilva)<br />[💻](https://github.com/catho/Spalatum/commits?author=ddsilva "Code") [📖](https://github.com/catho/Spalatum/commits?author=ddsilva "Documentation") [👀](#review-ddsilva "Reviewed Pull Requests") | [<img src="https://avatars0.githubusercontent.com/u/2933509?v=4" width="100px;"/><br /><sub><b>Luiz Kota</b></sub>](https://github.com/luizdesign)<br />[💻](https://github.com/catho/Spalatum/commits?author=luizdesign "Code") [📖](https://github.com/catho/Spalatum/commits?author=luizdesign "Documentation") [👀](#review-luizdesign "Reviewed Pull Requests") | [<img src="https://avatars3.githubusercontent.com/u/32010?v=4" width="100px;"/><br /><sub><b>José Luiz Coe</b></sub>](https://br.linkedin.com/in/joseluizcoe)<br />[💻](https://github.com/catho/Spalatum/commits?author=joseluizcoe "Code") [📖](https://github.com/catho/Spalatum/commits?author=joseluizcoe "Documentation") [👀](#review-joseluizcoe "Reviewed Pull Requests") | [<img src="https://avatars0.githubusercontent.com/u/6536985?v=4" width="100px;"/><br /><sub><b>Gabriel Daltoso</b></sub>](http://ggdaltoso.info)<br />[💻](https://github.com/catho/Spalatum/commits?author=ggdaltoso "Code") [📖](https://github.com/catho/Spalatum/commits?author=ggdaltoso "Documentation") [👀](#review-ggdaltoso "Reviewed Pull Requests") | [<img src="https://avatars3.githubusercontent.com/u/4368481?v=4" width="100px;"/><br /><sub><b>Alan Oliv.</b></sub>](https://github.com/nuncaesqueca)<br />[💻](https://github.com/catho/Spalatum/commits?author=nuncaesqueca "Code") [👀](#review-nuncaesqueca "Reviewed Pull Requests") |
| :---: | :---: | :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
