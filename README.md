# Render
It's a temporary name. Help us to define it [here](http://gitlab.devel/watchmen/render/issues/2).

## How it works
The Render is a lib to render fragments in a template.

## Instalation
For install execute de command below:
```sh
# You can use npm, as well
yarn add @cathodevel/render
```

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
You can use multiple fragments together to assembly a web application:
```html
<html>
  <body>
    <fragment href="http://header.fragment.com/" />
    <div>Main Localy Rendered App</div>
    <fragment href="http://banner.fragment.com/" proxy="http://proxyserver.com" />
    <fragment href="http://footer.fragment.com/" />
  </body>
</html>
```


#### This nodejs example call the Render function, passing to it a template string and get the return value as a Promise instance, which will be resolved with the parsed html:
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
