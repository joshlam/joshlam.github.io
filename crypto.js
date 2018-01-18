const http = require('http');
const https = require('https');

const PORT = 8080;

const requestHandler = (request, response) => {
  if (!request.url.match('\/crypto') || !request.url.match('arbitrage')) return;

  const bittrexPricesPromise = new Promise(resolve => {
    https.get('https://bittrex.com/api/v1.1/public/getmarketsummaries', res => {
      let body = '';

      res.on('data', data => {
        body += data;
      });

      res.on('end', () => {
        resolve(JSON.parse(body).result.reduce((prices, market) => {
          const base = market.MarketName.split('-')[0];

          if (base != 'BTC') return prices;

          const currency = market.MarketName.split('-')[1];

          prices[currency] = {
            bid: market.Bid,
            ask: market.Ask,
            last: market.Last
          };

          return prices;
        }, {}));
      });

    }).on('error', error => {
      console.error(error);
    });
  });

  const bittrexWalletsPromise = new Promise(resolve => {
    https.get('https://bittrex.com/api/v2.0/pub/currencies/GetWalletHealth', res => {
      let body = '';

      res.on('data', data => {
        body += data;
      });

      res.on('end', () => {
        const derp =
        resolve(JSON.parse(body).result.reduce((statuses, status) => {
          const currency = status.Currency.Currency;

          statuses[currency] = {
            depositQueueDepth: status.Health.DepositQueueDepth,
            withdrawQueueDepth: status.Health.WithdrawQueueDepth,
            lastUpdated: status.Health.MinutesSinceBHUpdated,
            walletActive: status.Health.IsActive,
            confirmations: status.Currency.MinConfirmation,
            marketActive: status.Currency.IsActive,
            notice: status.Currency.Notice
          };

          return statuses;
        }, {}));
      });

    }).on('error', error => {
      console.error(error);
    });
  });

  const binancePricesPromise = new Promise(resolve => {
    https.get('https://www.binance.com/api/v1/ticker/allPrices', res => {
      let body = '';

      res.on('data', data => {
        body += data;
      });

      res.on('end', () => {
        resolve(JSON.parse(body).reduce((prices, market) => {
          if (!market.symbol.match('BTC')) return prices;

          const currency = market.symbol.split('BTC')[0];

          prices[currency] = market.price;

          return prices;
        }, {}));
      });

    }).on('error', error => {
      console.error(error);
    });
  });

  const binanceOrdersPromise = new Promise(resolve => {
    https.get('https://www.binance.com/api/v1/ticker/allBookTickers', res => {
      let body = '';

      res.on('data', data => {
        body += data;
      });

      res.on('end', () => {
        resolve(JSON.parse(body).reduce((prices, market) => {
          if (!market.symbol.match('BTC')) return prices;

          const currency = market.symbol.split('BTC')[0];

          delete market.symbol;

          prices[currency] = market;

          return prices;
        }, {}));
      });

    }).on('error', error => {
      console.error(error);
    });
  });

  Promise.all([
    bittrexPricesPromise,
    bittrexWalletsPromise,
    binancePricesPromise,
    binanceOrdersPromise
  ]).then(([bittrexPrices, bittrexWallets, binancePrices, binanceOrders]) => {
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Origin', '*');

    response.end(
      JSON.stringify({
        bittrexPrices,
        bittrexWallets,
        binancePrices,
        binanceOrders
      })
    );
  });
}

const server = http.createServer(requestHandler);

server.listen(PORT, error => {
  if (error) return console.log(error);

  console.log(`server is listening on ${PORT}`);
});
