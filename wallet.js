const { sendNotification } = require('./twilio');

let lastMarketNotification = Date.now();
let lastQueueNotification = Date.now() - 300000;
let bittrexWallets;
let binanceMarkets;

exports.checkMarkets = function checkMarkets({ bittrex, binance }) {
  const now = Date.now();
  const notifications = [];

  if (!bittrexWallets) bittrexWallets = bittrex;

  if (Object.keys(bittrexWallets).length != Object.keys(bittrex).length) {
    const newMarkets = Object.keys(bittrex).filter(currency => !bittrexWallets[currency]);
    const removedMarkets = Object.keys(bittrexWallets).filter(currency => !bittrex[currency]);

    notifications.push(`Potential new Bittrex market(s): ${newMarkets.join('; ')}`);
    notifications.push(`Potential removed Bittrex market(s): ${removedMarkets.join('; ')}`);

    bittrexWallets = bittrex;
  }

  if (!binanceMarkets) binanceMarkets = binance;

  if (Object.keys(binanceMarkets).length != Object.keys(binance).length) {
    const newMarkets = Object.keys(binance).filter(currency => !binanceMarkets[currency]);
    const removedMarkets = Object.keys(binanceMarkets).filter(currency => !binance[currency]);

    notifications.push(`Potential new Binance market(s): ${newMarkets.join('; ')}`);
    notifications.push(`Potential removed Binance market(s): ${removedMarkets.join('; ')}`);

    binanceMarkets = binance;
  }

  if (notifications.length > 0) {
    lastMarketNotification = now;

    console.log('Sending notifications', notifications.join('; '));

    sendNotification({ body: notifications.join('; '), tag: 'all' });
  }
};

exports.checkQueues = function checkQueues(wallets) {
  const now = Date.now();
  const notifications = [];

  Object.keys(wallets).forEach(currency => {
    if (currency === 'TROLL') return;

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

  if (now - lastQueueNotification > 300000 && notifications.length > 0) {
    lastQueueNotification = now;

    console.log('Sending notifications', notifications.join('; '));

    sendNotification({ body: notifications.join('; '), tag: 'all' });
  }
};
