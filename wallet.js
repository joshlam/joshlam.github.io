const { TIME } = require('./constants');
const { sendNotification } = require('./twilio');

const cache = {};

let lastMarketNotification = Date.now();
let lastQueueNotification = Date.now() - 5 * TIME.MINUTE;

function checkExchangeData(key, exchangeData, exchange, notifications) {
  if (Object.keys(exchangeData).length === 0) return;

  if (!cache[key]) cache[key] = exchangeData;

  if (Object.keys(cache[key]).length != Object.keys(exchangeData).length) {
    const newMarkets = Object.keys(exchangeData).filter(currency => !cache[key][currency]);
    const removedMarkets = Object.keys(cache[key]).filter(currency => !exchangeData[currency]);

    console.log(`Diff in ${exchange} data: ${key}`);
    console.log(`${exchange} market cached: ${JSON.stringify(cache[key])}`);
    console.log(`${exchange} market current: ${JSON.stringify(exchangeData)}`);

    if (exchange === 'Kucoin') {
      console.log(`Potential new ${exchange} market(s): ${newMarkets.join('; ')}`);
      console.log(`Potential removed ${exchange} market(s): ${removedMarkets.join('; ')}`);
    } else {
      notifications.push(`Potential new ${exchange} market(s): ${newMarkets.join('; ')}`);
      notifications.push(`Potential removed ${exchange} market(s): ${removedMarkets.join('; ')}`);
    }

    cache[key] = exchangeData;
  }
}

exports.checkMarkets = function checkMarkets(exchangeData) {
  const now = Date.now();
  const notifications = [];

  ['bittrexWallets', 'bittrexPrices'].forEach(key => checkExchangeData(key, exchangeData[key], 'Bittrex', notifications));
  [/*'binanceWallets', */'binancePrices'].forEach(key => checkExchangeData(key, exchangeData[key], 'Binance', notifications));
  ['kucoinWallets', 'kucoinPrices'].forEach(key => checkExchangeData(key, exchangeData[key], 'Kucoin', notifications));

  checkExchangeData('krakenPrices', exchangeData.krakenPrices, 'Kraken', notifications);

  if (notifications.length > 0) {
    lastMarketNotification = now;

    console.log('Sending notifications', notifications.join('; '));

    sendNotification(notifications.join('; '));
  }
};

exports.checkQueues = function checkQueues(wallets, prices) {
  const now = Date.now();
  const notifications = [];

  Object.keys(wallets).forEach(currency => {
    if (currency === 'BTC') return;

    const { depositQueueDepth, withdrawQueueDepth } = wallets[currency];
    const price = prices[currency] ? prices[currency].last : null;

    if (depositQueueDepth > 5) {
      console.log(`${currency} depositQueue: ${depositQueueDepth}, price: ${price}`);

      notifications.push(`${currency} depositQueue: ${depositQueueDepth}, price: ${price}`);
    }

    if (withdrawQueueDepth > 10) {
      console.log(`${currency} withdrawQueue: ${withdrawQueueDepth}, price: ${price}`);

      notifications.push(`${currency} withdrawQueue: ${withdrawQueueDepth}, price: ${price}`);
    }
  });

  if (now - lastQueueNotification > 5 * TIME.MINUTE && notifications.length > 0) {
    lastQueueNotification = now;

    console.log('Sending notifications', notifications.join('; '));

    sendNotification(notifications.join('; '));
  }
};
