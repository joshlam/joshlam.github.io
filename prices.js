const https = require('https');

const { CRYPTO, MAX_BACKOFF, MIN_BACKOFF, TIME } = require('./constants');
const formatDate = require('./date');
const { sendNotification } = require('./twilio');
const { checkMarkets, checkQueues } = require('./wallet');
const websocket = require('./websocket');

const backoff = {};
let cachedPrices = {};
let lastPriceCheck = Date.now();
let lastUpdatedDateNotification = Date.now();

function reduce(collection, reducer, initial) {
  if (Array.isArray(collection)) return collection.reduce(reducer, initial);

  return Object.keys(collection).reduce((array, key) => {
    array.push(Object.assign({}, collection[key], { key }));

    return array;
  },[]).reduce(reducer, initial);
}

function exponentialBackoff(currentBackoff = 0) {
  return Math.min([
    MAX_BACKOFF,
    Math.max([2 * currentBackoff, MIN_BACKOFF])
  ]);
}

function get(endpoint, reducer, initial = {}) {
  return new Promise((resolve, reject) => {
    if (backoff[endpoint] && backoff[endpoint] > Date.now() - lastPriceCheck) {
      return void resolve({});
    }

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

          resolve(reducer ? reduce(response, reducer, initial) : response);

          backoff[endpoint] = 0;
        } catch (error) {
          console.log(`Parsing error for ${endpoint}: ${error}`);
          console.log(`Body: ${body}`);

          resolve({});

          backoff[endpoint] = exponentialBackoff(backoff[endpoint]);
        }
      });
    }).on('error', error => {
      console.log(`Price fetch error for ${endpoint}: ${error}`);

      resolve({});

      backoff[endpoint] = exponentialBackoff(backoff[endpoint]);
    });
  });
}

function normalize(exchangeName) {
  const currency = exchangeName.toUpperCase();

  switch (currency) {
    case 'BCC': return 'BCH';
    case 'PROPY': return 'PRO';
    case 'XRB': return 'NANO';
    case 'XETC': return 'ETC';
    case 'XETH': return 'ETH';
    case 'XICN': return 'ICN';
    case 'XLTC': return 'LTC';
    case 'XMLN': return 'MLN';
    case 'XREP': return 'REP';
    case 'XXDG': return 'DOGE';
    case 'XXLM': return 'XLM';
    case 'XXMR': return 'XMR';
    case 'XXRP': return 'XRP';
    case 'XZEC': return 'ZEC';
    case 'USD': return 'USDT';
    case 'E': return 'EBTC';
    case 'S': return 'SBTC';
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
  kucoinWallets,
  krakenPrices,
  hitbtcPrices,
  hitbtcWallets
}) {
  return CRYPTO.reduce((currencies, currency) => {
    const exchangeData = {};

    if (bittrexPrices[currency]) {
      exchangeData.bittrex = {
        bid: bittrexPrices[currency].bid,
        ask: bittrexPrices[currency].ask,
        last: bittrexPrices[currency].last,
        marketActive: bittrexPrices[currency].marketActive,
        notice: bittrexPrices[currency].notice
      };
    }

    if (bittrexWallets[currency]) {
      if (!exchangeData.bittrex) exchangeData.bittrex = {};

      const walletNotice = bittrexWallets[currency].notice || null;

      Object.assign(exchangeData.bittrex, {
        confirmations: bittrexWallets[currency].confirmations,
        depositsEnabled: bittrexWallets[currency].walletActive,
        withdrawalsEnabled: bittrexWallets[currency].walletActive,
        notice: exchangeData.bittrex.notice
          ? `${exchangeData.bittrex.notice}; ${walletNotice}`
          : walletNotice
      });
    }

    if (binanceOrders[currency]) {
      exchangeData.binance = {
        bid: binanceOrders[currency].bid,
        ask: binanceOrders[currency].ask,
        marketActive: true
      };
    }

    if (binancePrices[currency]) {
      if (!exchangeData.binance) exchangeData.binance = { marketActive: true };

      Object.assign(exchangeData.binance, { last: binancePrices[currency] });
    }

    if (binanceWallets[currency]) {
      if (!exchangeData.binance) exchangeData.binance = { marketActive: true };

      Object.assign(exchangeData.binance, {
        confirmations: binanceWallets[currency].confirmations,
        depositsEnabled: binanceWallets[currency].depositsEnabled,
        withdrawalsEnabled: binanceWallets[currency].withdrawalsEnabled,
        notice: binanceWallets[currency].notice
      });
    }

    if (huobiPrices[currency]) {
      exchangeData.huobi = {
        bid: huobiPrices[currency].bid,
        ask: huobiPrices[currency].ask,
        last: huobiPrices[currency].bid,
        marketActive: huobiPrices[currency].marketActive
      };
    }

    if (huobiWallets[currency]) {
      if (!exchangeData.huobi) exchangeData.huobi = {};

      Object.assign(exchangeData.huobi, {
        confirmations: huobiWallets[currency].confirmations,
        depositsEnabled: huobiWallets[currency].depositsEnabled,
        withdrawalsEnabled: huobiWallets[currency].withdrawalsEnabled,
        notice: huobiWallets[currency].notice
      });
    }

    if (kucoinPrices[currency]) {
      exchangeData.kucoin = {
        bid: kucoinPrices[currency].bid,
        ask: kucoinPrices[currency].ask,
        last: kucoinPrices[currency].last,
        marketActive: kucoinPrices[currency].marketActive
      };
    }

    if (kucoinWallets[currency]) {
      if (!exchangeData.kucoin) exchangeData.kucoin = {};

      Object.assign(exchangeData.kucoin, {
        confirmations: kucoinWallets[currency].confirmations,
        depositsEnabled: kucoinWallets[currency].depositsEnabled,
        withdrawalsEnabled: kucoinWallets[currency].withdrawalsEnabled,
        notice: kucoinWallets[currency].notice
      });
    }

    if (krakenPrices[currency]) {
      exchangeData.kraken = {
        bid: krakenPrices[currency].bid,
        ask: krakenPrices[currency].ask,
        last: krakenPrices[currency].last,
        marketActive: krakenPrices[currency].marketActive,
        confirmations: krakenPrices[currency].confirmations,
        depositsEnabled: krakenPrices[currency].depositsEnabled,
        withdrawalsEnabled: krakenPrices[currency].withdrawalsEnabled,
        notice: krakenPrices[currency].notice
      };
    }

    if (hitbtcPrices[currency]) {
      exchangeData.hitbtc = {
        bid: hitbtcPrices[currency].bid,
        ask: hitbtcPrices[currency].ask,
        last: hitbtcPrices[currency].last
      };
    }

    if (hitbtcWallets[currency]) {
      if (!exchangeData.hitbtc) exchangeData.hitbtc = {};

      Object.assign(exchangeData.hitbtc, {
        confirmations: hitbtcWallets[currency].confirmations,
        depositsEnabled: hitbtcWallets[currency].depositsEnabled,
        withdrawalsEnabled: hitbtcWallets[currency].withdrawalsEnabled,
        marketActive: hitbtcWallets[currency].marketActive,
        notice: null
      });
    }

    currencies[currency] = exchangeData;

    return currencies;
  }, {});
}

function getPrices(diff) {
  lastPriceCheck = Date.now();

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
    const isInactive = market.delist && !market['trade-enabled'];

    if (market['quote-currency'] != 'btc' || isInactive) return prices;

    const currency = normalize(market['base-currency']);

    prices[currency] = { marketActive: market['trade-enabled'] };

    huobiSymbols.push({
      currency,
      symbol: `${market['base-currency']}${market['quote-currency']}`
    });

    return prices;
  }).then(prices => {
    if (huobiSymbols.length === 0) return prices;

    const wsStore = websocket.init('wss://api.huobi.pro/ws',
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
        resolve(prices);

        try {
          wsStore.closed = true;

          wsStore.ws.close();
        } catch (error) {
          console.log(`socket close error: ${error}`)
        }
      }, 2000);
    });
  }).catch(error => {
    console.log(`Error in Huobi price fetch: ${error}`);

    return Promise.resolve({});
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

  const krakenSymbols = [];
  const krakenPricesPromise = get('https://api.kraken.com/0/public/AssetPairs', (prices, market) => {
    if (market.quote != 'XXBT') return prices;

    const currency = normalize(market.base);

    prices[currency] = {
      marketActive: true,
      confirmations: null,
      depositsEnabled: true,
      withdrawalsEnabled: true,
      notice: null
    };

    const quote = market.base[0] === 'X' && market.base !== 'XTZ' ? market.quote : market.quote.slice(1);

    krakenSymbols.push({
      currency,
      symbol: `${market.base}${quote}`
    });

    return prices;
  }).then(prices => {
    if (krakenSymbols.length === 0) return prices;

    return get(`https://api.kraken.com/0/public/Ticker?pair=${krakenSymbols.map(({ symbol }) => symbol)}`, (coins, market) => {
      Object.assign(
        coins[krakenSymbols.find(({ symbol }) => symbol === market.key).currency],
        {
          bid: Number(market.b[0]),
          bidQty: Number(market.b[1]),
          ask: Number(market.a[0]),
          askQty: Number(market.a[1]),
          last: Number(market.c[0])
        }
      );

      return coins;
    }, prices);
  }).catch(error => {
    console.log(`Error in Kraken price fetch: ${error}`);

    return Promise.resolve({});
  });

  const hitbtcPricesPromise = get('https://api.hitbtc.com/api/2/public/ticker', (prices, market) => {
    if (market.symbol.slice(market.symbol.length - 3) !== 'BTC') return prices;

    const currency = market.symbol.split('BTC')[0];

    prices[normalize(currency)] = {
      bid: Number(market.bid),
      ask: Number(market.ask),
      last: Number(market.last)
    };

    return prices;
  });

  const hitbtcWalletsPromise = get('https://api.hitbtc.com/api/2/public/currency', (wallets, wallet) => {
    if (wallet.delisted) return wallets;

    wallets[normalize(wallet.id)] = {
      confirmations: wallet.payinConfirmations,
      depositsEnabled: wallet.payinEnabled,
      withdrawalsEnabled: wallet.payoutEnabled,
      marketActive: true,
      notice: null
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
    kucoinWalletsPromise,
    krakenPricesPromise,
    hitbtcPricesPromise,
    hitbtcWalletsPromise
  ]).then(([
    bittrexPrices,
    bittrexWallets,
    binancePrices,
    binanceOrders,
    binanceWallets,
    huobiPrices,
    huobiWallets,
    kucoinPrices,
    kucoinWallets,
    krakenPrices,
    hitbtcPrices,
    hitbtcWallets
  ]) => {
    const exchangeData =  {
      bittrexPrices,
      bittrexWallets,
      binancePrices,
      binanceOrders,
      binanceWallets,
      huobiPrices,
      huobiWallets,
      kucoinPrices,
      kucoinWallets,
      krakenPrices,
      hitbtcPrices,
      hitbtcWallets
    };

    cachedPrices = {
      exchangeData,
      normalized: normalizeExchangeData(exchangeData),
      lastUpdated: new Date()
    };

    try {
      checkMarkets(exchangeData);
    } catch (error) {
      console.log(`Error in checking market: ${error}`);
    }

    try {
      checkQueues(bittrexWallets, bittrexPrices);
    } catch (error) {
      console.log(`Error in checking queues: ${error}`);
    }

    try {
      diff(cachedPrices.normalized);
    } catch (error) {
      console.log(`Error in calculating diffs: ${error}`);
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

  if (timeSinceLastUpdate > 25 * TIME.SECOND) {
    lastUpdatedDateNotification = now;

    if (now - lastUpdatedDateNotification > 30 * TIME.MINUTE) {
      sendNotification(`Price fetch loop broken for ${timeSinceLastUpdate / TIME.MINUTE} minutes`);
    }

    getPrices(diff);
  }

  return Object.assign({},
    denormalized ? cachedPrices.exchangeData : cachedPrices.normalized,
    { lastUpdated: formatDate(cachedPrices.lastUpdated) }
  );
};
