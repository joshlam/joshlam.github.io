const http = require('http');

const { getCachedPrices, getPrices } = require('./prices');
const diff = require('./diff');

const PORT = 8080;

const requestHandler = (request, response) => {
  if (!request.url.match('\/crypto') || !request.url.match('arbitrage')) return;

  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', '*');

  response.end(JSON.stringify(getCachedPrices()));
}

const server = http.createServer(requestHandler);

server.listen(PORT, error => {
  if (error) return console.log(error);

  console.log(`server is listening on ${PORT}`);
});

getPrices(diff);
