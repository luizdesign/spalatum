module.exports = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Unit Test</title>
  </head>
  <body>
    <header>
      <h1>Example of fragment with 404 on request</h1>
    </header>
    <fragment href="https://httpbin.org/notfound/" primary />
    <fragment href="https://httpbin.org/" />
  </body>
</html>`;
