# Render
It's a temporary name. Help us to define it [here](http://gitlab.devel/watchmen/render/issues/2).

## Instalation
For install the project execute de command below:
```sh
npm install --save render
```

## How it works
The Render is a lib to render fragments in a template.

### Example
Do you have a template:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Template Example</title>
  </head>
  <body>
    <fragment href="http://example.fragment.com/"></fragment>
  </body>
</html>
```
If the route http://example.fragment.com/ response with:
```html
<header>
  <h1>This is a Fragment</h1>
</header>
```
The Render will return:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Template Example</title>
  </head>
  <body>
    <header>
      <h1>This is a Fragment</h1>
    </header>
  </body>
</html>
```

#### The code example
```javascript
const Render = require('render');
const template = 'your template code';

const getRenderedTemplate = async () => await Render(template);
```

## Development
The first step is read the [contribution guide](http://gitlab.devel/watchmen/render/blob/master/CONTRIBUTING.MD).

### Getting Started
Prerequisites:
- [Git](https://git-scm.com/);
- [Node.js](https://nodejs.org/en/);

Start with the following command lines:
```sh
git clone http://gitlab.devel/watchmen/render
```

### Dependencies instalation
After you clone the project, you need access the folder and install the project's dependencies, for it runs the command below:
```sh
cd render && npm install
```

### Running the tests
Before send a Pull Request, always runs the tests, for it execute the command below:
```sh
npm test
# or
npm run coverage
```

## Contributing
Use [GitLab issues](http://gitlab.devel/watchmen/render/issues) for requests. Learn how to [contribute](http://gitlab.devel/watchmen/render/blob/master/CONTRIBUTING.MD).
