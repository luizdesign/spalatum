# Spalatum

[![build status](http://gitlab.devel/frontend-platform/spalatum/badges/master/build.svg)](http://gitlab.devel/frontend-platform/spalatum/commits/master)
[![coverage report](http://gitlab.devel/frontend-platform/spalatum/badges/master/coverage.svg)](http://gitlab.devel/frontend-platform/spalatum/commits/master)

Spalatum is a library that provides a middleware which you can integrate into any Node.js. With Spalatum you can get multiple external fragments and serve all together in your html page. This project is based on [Tailor](https://github.com/zalando/tailor).

Some of Spalatum features and benefits:

* **Composes pre-rendered markup on the backend**. This is important for SEO and fastens the initial render.
* **Enforces performance budget**. This is quite challenging otherwise, because there is no single point where you can control performance.
* **Cache Management** - When you use `cache` attribute in `<fragment>` tag, your app performace will be improved. With spalatum's cache management  we give you the power to see what is cached, delete some specific endpoint or just purge all cached fragment.
* **Remove duplicated assets** - Spalatum avoid multiple requests for an external Javascript or CSS, preserving only the first. So, if you have 2 or more fragments importing the same JS/CSS lib, we will remove all duplicated call starting from the second.
* **Express Middleware to pass browser headers to fragments** - Spalatum have a built in middleware that you can use when your app needs to send browser headers to the fragment.

## Before start

Before start, you must understand Fragment.

### Fragment

We understand "Fragment" as every endpoint hosted on http(s) server that provide the content you want to include in your page. If you want to use some specific js or css, you can use `script`, `style`, `Link` or any other tags in your template page to provide this resources. Check our **[example app using *Spalatum*](http://gitlab.devel/frontend-platform/spalatum-app-skeleton)** for the skeleton implementation.

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


### Express Middleware
If you app need to pass all browser headers to a fragment, Spalatum provides a middleware to use called `spalatumMiddleware`.

Example:

```javascript
const { spalatum, spalatumMiddleware } = require('@cathodevel/spalatum');
const express = require('express');

const app = express();
/*  Middleware will be used and all browser headers will be
 *  included in every request to the fragments
 */
app.use(spalatumMiddleware);

app.get('/', async (req, res) => {
  const template = `
    <html>
      <body>
        <fragment href="www.catho.com.br" />
      </body>
    </html>
  `;

  const templateResult = await spalatum.render(template);
  res.send(templateResult);
});

app.listen(3000);
```

---

## Instalation
*IMPORTANT:* To install *Spalatum*, you must to add a _**.npmrc**_ file at project root with this content:

```
registry="http://armazem.devel:4873/"
```

Then, use the command below to add *Spalatum* as your project dependencie:
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

This nodejs example create a Spalatum instance, setting to it a cache object, then call the render method passing to it a template string that returns a Promise instance, which will be resolved with the parsed html or reject in error case:
```javascript
const { spalatum } = require('@cathodevel/spalatum');
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

  const templateResult = await spalatum.render(template);
  res.send(templateResult);
});

app.listen(3000);
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
