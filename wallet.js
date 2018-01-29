const { TIME } = require('./constants');
const { sendNotification } = require('./twilio');

const cache = {};

let lastMarketNotification = Date.now();
let lastQueueNotification = Date.now() - 5 * TIME.MINUTE;

function checkExchangeData(key, exchangeData, exchange, notifications) {
  if (!cache[key]) cache[key] = exchangeData;

  if (Object.keys(cache[key]).length != Object.keys(exchangeData).length) {
    const newMarkets = Object.keys(exchangeData).filter(currency => !cache[key][currency]);
    const removedMarkets = Object.keys(cache[key]).filter(currency => !exchangeData[currency]);

    if (exchange === 'Kucoin') {
      console.log(`Kucoin market cached: ${JSON.stringify(cache[key])}`);
      console.log(`Kucoin market current: ${JSON.stringify(exchangeData)}`);
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
  ['binanceWallets', 'binancePrices'].forEach(key => checkExchangeData(key, exchangeData[key], 'Binance', notifications));
  ['kucoinWallets', 'kucoinPrices'].forEach(key => checkExchangeData(key, exchangeData[key], 'Kucoin', notifications));

  if (notifications.length > 0) {
    lastMarketNotification = now;

    console.log('Sending notifications', notifications.join('; '));

    sendNotification(notifications.join('; '));
  }
};

exports.checkQueues = function checkQueues(wallets) {
  const now = Date.now();
  const notifications = [];

  Object.keys(wallets).forEach(currency => {
    const { depositQueueDepth, withdrawQueueDepth } = wallets[currency];

    if (depositQueueDepth > 5) {
      console.log(`${currency} depositQueueDepth: ${depositQueueDepth}`);

      notifications.push(`${currency} depositQueueDepth: ${depositQueueDepth}`);
    }

    if (withdrawQueueDepth > 10) {
      console.log(`${currency} withdrawQueueDepth: ${withdrawQueueDepth}`);

      notifications.push(`${currency} withdrawQueueDepth: ${withdrawQueueDepth}`);
    }
  });

  if (now - lastQueueNotification > 5 * TIME.MINUTE && notifications.length > 0) {
    lastQueueNotification = now;

    console.log('Sending notifications', notifications.join('; '));

    sendNotification(notifications.join('; '));
  }
};