# RenderLib (temporary name)
**[Help us to choose one name to this lib](http://gitlab.devel/watchmen/render/issues/2)**

RenderLib is a library that provides a middleware which you can integrate into any Node.js. This project is based on [Tailor](https://github.com/zalando/tailor).

Some of RenderLib's features and benefits:

* **Composes pre-rendered markup on the backend**. This is important for SEO and fastens the initial render.
* **Enforces performance budget**. This is quite challenging otherwise, because there is no single point where you can control performance.

## Fragment

A fragment is an http(s) server that renders only the part of the page and sets `Link` header to provide urls to CSS and JavaScript resources. Check our **[example app using *Render Lib*](http://gitlab.devel/frontend-platform/render-scaffolding)** for the skeleton implementation.

### Fragment Tag
You can represent a Fragment using  the ```<fragment />``` tag with this attributes: href, proxy, cache.

#### href *(needed)*
Represent the endpoint that provide the content you want to include in your page. 
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
*Render Lib* represent cache lifetime as *[Momentjs](http://momentjs.com/docs/)* does.

Example: 

| Time	| Cache attribute |
|-----|:-----------|
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


---

## Instalation
To install *Render Lib*, use the command below:
```sh
# You can use npm, as well
yarn add @cathodevel/render
```

## Getting Started
To get started, you can create your own app using ```"@cathodevel/render": "^VERSION"``` as dependencie in your ```package.json```; or clone the **[app skeleton using nodejs and *Render Lib* (RECOMENDED)](http://gitlab.devel/frontend-platform/render-scaffolding)** that we provide.

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
The Render will return:
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


This nodejs example call the Render function, passing to it a template string and get the return value as a Promise instance, which will be resolved with the parsed html:
```javascript
const Render = require('@cathodevel/render');
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

  const templateResult = await Render(template);
  res.send(templateResult);
});

app.listen(3000);

```

## Contributing

- Check the [issues](http://gitlab.devel/watchmen/render/issues) to ensure that there is not someone already working on it
- Check our [contribution guide](http://gitlab.devel/watchmen/render/blob/master/CONTRIBUTING.MD)

### Technical prerequisites
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/)

Clone this repository:
```sh
git clone http://gitlab.devel/watchmen/render
```

Access the folder and install the project's dependencies:
```sh
cd render && npm install
```

Before send a pull request, always runs the unit tests:
```sh
npm test
# or
npm run coverage
```
