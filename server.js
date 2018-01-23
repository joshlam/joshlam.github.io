const http = require('http');

const { diff, getNotifications } = require('./diff');
const { getCachedPrices, getPrices } = require('./prices');
const { registerBind, setLastRequestTime } = require('./twilio');

const PORT = 8080;

process.on('uncaughtException', err => {
  console.log(`Caught exception: ${err}`, err.stack);
});

const requestHandler = (request, response) => {
  console.log(request.url);

  setLastRequestTime(Date.now());

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Expires', 0);
  response.setHeader('Pragma', 'no-cache');

  if (request.url.match('\/register')) {
    let body = '';

    request.on('data', chunk => {
      body += chunk;
    }).on('end', () => {
      registerBind(JSON.parse(body)).then(data => {
        response.statusCode = data.status;
        response.end(JSON.stringify(data.data));
      });
    });
  }

  if (request.url.match('\/notifications')) {
    response.end(JSON.stringify(getNotifications()));
  }

  if (!request.url.match('\/crypto') || !request.url.match('arbitrage')) return;

  response.end(JSON.stringify(getCachedPrices()));
}

const server = http.createServer(requestHandler);

server.listen(PORT, error => {
  if (error) return console.log(`Server error: ${error}`);

  console.log(`server is listening on ${PORT}`);
});

getPrices(diff);
