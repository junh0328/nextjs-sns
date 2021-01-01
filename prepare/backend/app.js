const http = require('http');
const port = 3065;
const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  res.write('<h1>Hello node! </h1>');
  res.end('Hello node');
});

server.listen(port, () => {
  console.log(`server is listening on port : ${port}`);
});
