const https = require('https');

const formatDate = require('./date');
const { checkMarkets, checkQueues } = require('./wallet');

let cachedPrices = {};

exports.getCachedPrices = function getCachedPrices() {
  return cachedPrices;
};

function get(endpoint, reducer) {
  return new Promise((resolve, reject) => {
    https.get(endpoint, res => {
      let body = '';

      res.on('data', data => {
        body += data;
      });

      res.on('end', () => {
        let jsonResponse;

        try {
          jsonResponse = JSON.parse(body);
        } catch (error) {
          console.log(`Parsing error for ${endpoint}: ${error}`);
          console.log(`Body: ${body}`);

          reject(error);

          return;
        }

        resolve(
          (jsonResponse.result ? jsonResponse.result : jsonResponse)
            .reduce(reducer, {})
        );
      });
    }).on('error', error => {
      console.log(`Price fetch error for ${endpoint}: ${error}`);

      reject(error);
    });
  });
}

exports.getPrices = function getPrices(diff) {
  const bittrexPricesPromise = get('https://bittrex.com/api/v2.0/pub/Markets/GetMarketSummaries', (prices, { Market: market, Summary: summary }) => {
    if (market.BaseCurrency != 'BTC') return prices;

    prices[market.MarketCurrency] = {
      bid: summary.Bid,
      ask: summary.Ask,
      last: summary.Last,
      marketActive: market.IsActive,
      notice: market.Notice
    };

    return prices;
  });

  const bittrexWalletsPromise = get('https://bittrex.com/api/v2.0/pub/currencies/GetWalletHealth', (statuses, status) => {
    const currency = status.Currency.Currency;

    if (currency === 'TROLL') return statuses;

    statuses[currency] = {
      depositQueueDepth: status.Health.DepositQueueDepth,
      withdrawQueueDepth: status.Health.WithdrawQueueDepth,
      lastUpdated: status.Health.MinutesSinceBHUpdated,
      walletActive: status.Health.IsActive,
      confirmations: status.Currency.MinConfirmation,
      notice: status.Currency.Notice
    };

    return statuses;
  });

  const binancePricesPromise = get('https://www.binance.com/api/v1/ticker/allPrices', (prices, market) => {
    if (!market.symbol.match('BTC')) return prices;

    const currency = market.symbol.split('BTC')[0];

    prices[currency] = Number(market.price);

    return prices;
  });

  const binanceOrdersPromise = get('https://www.binance.com/api/v1/ticker/allBookTickers', (prices, market) => {
    if (!market.symbol.match('BTC')) return prices;

    const currency = market.symbol.split('BTC')[0];

    prices[currency] = {
      bidPrice: Number(market.bidPrice),
      bidQty: Number(market.bidQty),
      askPrice: Number(market.askPrice),
      askQty: Number(market.askQty)
    };

    return prices;
  });

  const binanceWalletsPromise = get('https://www.binance.com/assetWithdraw/getAllAsset.html', (wallets, wallet) => {
    wallets[wallet.assetCode] = {
      confirmations: Number(wallet.confirmTimes),
      depositsEnabled: wallet.enableCharge,
      withdrawalsEnabled: wallet.enableWithdraw
    };

    return wallets;
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

    checkMarkets({ bittrexWallets, binanceWallets, bittrexPrices, binancePrices });
    checkQueues(bittrexWallets);
    diff(cachedPrices);

    setTimeout(getPrices, 1000, diff);
  }).catch(error => {
    console.log(`Price fetch error: ${error}`);
    console.log('Retrying price fetch');

    setTimeout(getPrices, 1500, diff);
  });
};
