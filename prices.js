const https = require('https');

const { CRYPTO, TIME } = require('./constants');
const formatDate = require('./date');
const { sendNotification } = require('./twilio');
const { checkMarkets, checkQueues } = require('./wallet');
const websocket = require('./websocket');

let cachedPrices = {};
let lastUpdatedDateNotification = Date.now();

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

          let response = jsonResponse;

          if (jsonResponse.result) {
            response = jsonResponse.result;
          } else if (jsonResponse.data) {
            response = jsonResponse.data;
          }

          resolve(reducer ? response.reduce(reducer, {}) : response);
        } catch (error) {
          console.log(`Parsing error for ${endpoint}: ${error}`);
          console.log(`Body: ${body}`);

          reject(error);

          return;
        }
      });
    }).on('error', error => {
      console.log(`Price fetch error for ${endpoint}: ${error}`);

      reject(error);
    });
  });
}

function normalize(exchangeName) {
  const currency = exchangeName.toUpperCase();

  switch (currency) {
    case 'BCC': return 'BCH';
    case 'PROPY': return 'PRO';
    case 'XRB': return 'NANO';
    default: return currency;
  }
}

function normalizeExchangeData({
  bittrexPrices,
  bittrexWallets,
  binancePrices,
  binanceOrders,
  binanceWallets,
  huobiPrices,
  huobiWallets,
  kucoinPrices,
  kucoinWallets
}) {
  return CRYPTO.reduce((currencies, currency) => {
    const exchangeData = {};

    if (bittrexPrices[currency]) {
      exchangeData.bittrex = {
        bid: bittrexPrices[currency].bid,
        ask: bittrexPrices[currency].ask,
        last: bittrexPrices[currency].last,
        marketActive: bittrexPrices[currency].marketActive,
        confirmations: bittrexWallets[currency].confirmations,
        depositsEnabled: bittrexWallets[currency].walletActive,
        withdrawalsEnabled: bittrexWallets[currency].walletActive,
        notice: bittrexPrices[currency].notice || bittrexWallets[currency].notice
          ? `${bittrexPrices[currency].notice}; ${bittrexWallets[currency].notice}`
          : null
      }
    }

    if (binancePrices[currency]) {
      exchangeData.binance = {
        bid: binanceOrders[currency].bid,
        ask: binanceOrders[currency].ask,
        last: binancePrices[currency],
        marketActive: true,
        confirmations: binanceWallets[currency].confirmations,
        depositsEnabled: binanceWallets[currency].depositsEnabled,
        withdrawalsEnabled: binanceWallets[currency].withdrawalsEnabled,
        notice: binanceWallets[currency].notice
      }
    }

    if (huobiPrices[currency]) {
      exchangeData.huobi = {
        bid: huobiPrices[currency].bid,
        ask: huobiPrices[currency].ask,
        last: huobiPrices[currency].bid,
        marketActive: huobiPrices[currency].marketActive,
        confirmations: huobiWallets[currency].confirmations,
        depositsEnabled: huobiWallets[currency].depositsEnabled,
        withdrawalsEnabled: huobiWallets[currency].withdrawalsEnabled,
        notice: huobiWallets[currency].notice
      }
    }

    if (kucoinPrices[currency]) {
      exchangeData.kucoin = {
        bid: kucoinPrices[currency].bid,
        ask: kucoinPrices[currency].ask,
        last: kucoinPrices[currency].last,
        marketActive: kucoinPrices[currency].marketActive,
        confirmations: kucoinWallets[currency].confirmations,
        depositsEnabled: kucoinWallets[currency].depositsEnabled,
        withdrawalsEnabled: kucoinWallets[currency].withdrawalsEnabled,
        notice: kucoinWallets[currency].notice
      }
    }

    currencies[currency] = exchangeData;

    return currencies;
  }, {});
}

function getPrices(diff) {
  const bittrexPricesPromise = get('https://bittrex.com/api/v2.0/pub/Markets/GetMarketSummaries', (prices, { Market: market, Summary: summary }) => {
    if (market.BaseCurrency != 'BTC' && market.MarketCurrency != 'BTC') return prices;

    prices[normalize(market.MarketCurrency)] = {
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

    statuses[normalize(currency)] = {
      depositQueueDepth: status.Health.DepositQueueDepth,
      withdrawQueueDepth: status.Health.WithdrawQueueDepth,
      lastUpdated: status.Health.MinutesSinceBHUpdated,
      walletActive: status.Health.IsActive,
      confirmations: status.Currency.MinConfirmation,
      notice: status.Currency.Notice
    };

    return statuses;
  });

  const binancePricesPromise = get('https://www.binance.com/api/v3/ticker/price', (prices, market) => {
    if (!market.symbol.match('BTC')) return prices;

    const currency = market.symbol.split('BTC')[0];

    prices[normalize(currency)] = Number(market.price);

    return prices;
  });

  const binanceOrdersPromise = get('https://api.binance.com/api/v3/ticker/bookTicker', (prices, market) => {
    if (!market.symbol.match('BTC')) return prices;

    const currency = market.symbol.split('BTC')[0];

    prices[normalize(currency)] = {
      bid: Number(market.bidPrice),
      bidQty: Number(market.bidQty),
      ask: Number(market.askPrice),
      askQty: Number(market.askQty)
    };

    return prices;
  });

  const binanceWalletsPromise = get('https://www.binance.com/assetWithdraw/getAllAsset.html', (wallets, wallet) => {
    wallets[normalize(wallet.assetCode)] = {
      confirmations: Number(wallet.confirmTimes),
      depositsEnabled: wallet.enableCharge,
      withdrawalsEnabled: wallet.enableWithdraw,
      notice: wallet.depositTipStatus ? wallet.depositTipEn : null
    };

    return wallets;
  });

  const huobiSymbols = [];
  const huobiPricesPromise = get('https://api.huobi.pro/v1/settings/symbols', (prices, market) => {
    if (market['quote-currency'] != 'btc') return prices;

    const currency = normalize(market['base-currency']);

    prices[currency] = { marketActive: market['trade-enabled'] };

    huobiSymbols.push({
      currency,
      symbol: `${market['base-currency']}${market['quote-currency']}`
    });

    return prices;
  }).then(prices => {
    const ws = websocket.init('wss://api.huobi.pro/ws',
      connection => {
        huobiSymbols.forEach(({ symbol }) => {
          connection.send(JSON.stringify({
            sub: `market.${symbol}.depth.step0`,
            id: symbol
          }));
        });
      },
      message => {
        const symbolToMatch = message.ch.split('.')[1];
        const currency = huobiSymbols.find(({ symbol }) => {
          return symbol === symbolToMatch;
        }).currency;

        const [bid, bidQty] = message.tick.bids[0];
        const [ask, askQty] = message.tick.asks[0];

        Object.assign(prices[currency], { bid, bidQty, ask, askQty });
      }
    );

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        ws.close();

        resolve(prices);
      }, 2000);
    });
  });

  const huobiWalletsPromise = get('https://api.huobi.pro/v1/settings/currencys?language=en-US', (wallets, wallet) => {
    wallets[normalize(wallet['display-name'])] = {
      confirmations: wallet['fast-confirms'],
      depositsEnabled: wallet['deposit-enabled'],
      withdrawalsEnabled: wallet['withdraw-enabled'],
      notice: wallet['deposit-desc'] || wallet['withdraw-desc'] ? `${wallet['deposit-desc']}; ${wallet['withdraw-desc']}` : null
    };

    return wallets;
  });

  const kucoinPricesPromise = get('https://api.kucoin.com/v1/market/open/symbols', (prices, market) => {
    if (market.coinTypePair != 'BTC') return prices;

    prices[normalize(market.coinType)] = {
      bid: market.buy,
      ask: market.sell,
      last: market.lastDealPrice,
      marketActive: market.trading
    };

    return prices;
  });

  const kucoinWalletsPromise = get('https://api.kucoin.com/v1/market/open/coins', (wallets, wallet) => {
    wallets[normalize(wallet.coin)] = {
      confirmations: wallet.confirmationCount,
      depositsEnabled: wallet.enableDeposit,
      withdrawalsEnabled: wallet.enableWithdraw,
      notice: wallet.depositRemark || wallet.withdrawRemark ? `${wallet.depositRemark}; ${wallet.withdrawRemark}` : null
    };

    return wallets;
  });

  Promise.all([
    bittrexPricesPromise,
    bittrexWalletsPromise,
    binancePricesPromise,
    binanceOrdersPromise,
    binanceWalletsPromise,
    huobiPricesPromise,
    huobiWalletsPromise,
    kucoinPricesPromise,
    kucoinWalletsPromise
  ]).then(([bittrexPrices, bittrexWallets, binancePrices, binanceOrders, binanceWallets, huobiPrices, huobiWallets, kucoinPrices, kucoinWallets]) => {
    const exchangeData =  {
      bittrexPrices,
      bittrexWallets,
      binancePrices,
      binanceOrders,
      binanceWallets,
      huobiPrices,
      huobiWallets,
      kucoinPrices,
      kucoinWallets
    };

    cachedPrices = {
      exchangeData,
      normalized: normalizeExchangeData(exchangeData),
      lastUpdated: new Date()
    };

    try {
      checkMarkets({ bittrexWallets, binanceWallets,  huobiWallets, kucoinWallets, bittrexPrices, binancePrices, huobiPrices, kucoinPrices });
      checkQueues(bittrexWallets, bittrexPrices);
      diff(exchangeData);
    } catch (error) {
      console.log(`Error in market data analysis: ${error}`);
    }

    setTimeout(getPrices, TIME.SECOND, diff);
  }).catch(error => {
    console.log(`Price fetch error: ${error}`);
    console.log('Retrying price fetch');

    setTimeout(getPrices, 2 * TIME.SECOND, diff);
  });
}

exports.getPrices = getPrices;

exports.getCachedPrices = function getCachedPrices(denormalized, diff) {
  const now = Date.now();
  const timeSinceLastUpdate = now - cachedPrices.lastUpdated;

  if (
    timeSinceLastUpdate > 10 * TIME.MINUTE
      && now - lastUpdatedDateNotification > 30 * TIME.MINUTE
  ) {
    lastUpdatedDateNotification = now;

    sendNotification(`Price fetch loop broken for ${timeSinceLastUpdate / TIME.MINUTE} minutes`);

    getPrices(diff);
  }

  return Object.assign({},
    denormalized ? cachedPrices.exchangeData : cachedPrices.normalized,
    { lastUpdated: formatDate(cachedPrices.lastUpdated) }
  );
};
