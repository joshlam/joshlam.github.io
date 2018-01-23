const https = require('https');

const formatDate = require('./date');
const { checkMarkets, checkQueues } = require('./wallet');

let cachedPrices = {};

exports.getCachedPrices = function getCachedPrices() {
  return cachedPrices;
};

exports.getPrices = function getPrices(diff) {
  const bittrexPricesPromise = new Promise((resolve, reject) => {
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
      console.log(`Bittrex price fetch error: ${error}`);

      reject(error);
    });
  });

  const bittrexWalletsPromise = new Promise((resolve, reject) => {
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
      console.log(`Bittrex wallet fetch error: ${error}`);

      reject(error);
    });
  });

  const binancePricesPromise = new Promise((resolve, reject) => {
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
      console.log(`Binance price fetch error: ${error}`);

      reject(error);
    });
  });

  const binanceOrdersPromise = new Promise((resolve, reject) => {
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
      console.log(`Binance order fetch error: ${error}`);

      reject(error);
    });
  });

  const binanceWalletsPromise = new Promise((resolve, reject) => {
    https.get('https://www.binance.com/assetWithdraw/getAllAsset.html', res => {
      let body = '';

      res.on('data', data => {
        body += data;
      });

      res.on('end', () => {
        resolve(JSON.parse(body).reduce((wallets, wallet) => {
          wallets[wallet.assetCode] = {
            confirmations: Number(wallet.confirmTimes),
            depositsEnabled: wallet.enableCharge,
            withdrawalsEnabled: wallet.enableWithdraw
          };

          return wallets;
        }, {}));
      });

    }).on('error', error => {
      console.log(`Binance wallet fetch error: ${error}`);

      reject(error);
    });
  });

  Promise.all([
    bittrexPricesPromise,
    bittrexWalletsPromise,
    binancePricesPromise,
    binanceOrdersPromise,
    binanceWalletsPromise
  ]).then(([bittrexPrices, bittrexWallets, binancePrices, binanceOrders, binanceWallets]) => {
    cachedPrices = {
      bittrexPrices,
      bittrexWallets,
      binancePrices,
      binanceOrders,
      binanceWallets,
      lastUpdated: formatDate(new Date())
    };

    checkMarkets({ bittrex: bittrexWallets, binance: binancePrices });
    checkQueues(bittrexWallets);
    diff(cachedPrices);

    setTimeout(getPrices, 1000, diff);
  }).catch(error => {
    console.log(`Price fetch error: ${error}`);
    console.log('Retrying price fetch');

    setTimeout(getPrices, 1500, diff);
  });
};
