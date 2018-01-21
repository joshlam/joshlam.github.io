const http = require('http');

const diff = require('./diff');
const { getCachedPrices, getPrices } = require('./prices');
const { registerBind } = require('./twilio');

const PORT = 8080;

const requestHandler = (request, response) => {
  console.log(request.url);

  if (request.url.match('\/register')) {
    let body = '';

    request.on('data', chunk => {
      body += chunk;
    }).on('end', () => {
      registerBind(JSON.parse(body)).then(data => {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.statusCode = data.status;
        response.end(JSON.stringify(data.data));
      });
    });
  }

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
