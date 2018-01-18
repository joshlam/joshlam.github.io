const http = require('http');
const https = require('https');

const PORT = 8080;

const requestHandler = (request, response) => {
  if (!request.url.match('\/crypto') || !request.url.match('arbitrage')) return;

  const bittrexPricesPromise = new Promise(resolve => {
    https.get('https://bittrex.com/api/v2.0/pub/Markets/GetMarketSummaries', res => {
      let body = '';

      res.on('data', data => {
        body += data;
      });

      res.on('end', () => {
        resolve(JSON.parse(body).result.reduce((prices, { Market: market, Summary: summary }) => {
          if (market.BaseCurrency != 'BTC') return prices;

          prices[market.MarketCurrency] = {
            bid: summary.Bid,
            ask: summary.Ask,
            last: summary.Last,
            marketActive: market.IsActive,
            notice: market.Notice
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

          prices[currency] = Number(market.price);

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

          prices[currency] = {
            bidPrice: Number(market.bidPrice),
            bidQty: Number(market.bidQty),
            askPrice: Number(market.askPrice),
            askQty: Number(market.askQty)
          };

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
