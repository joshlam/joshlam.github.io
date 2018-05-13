const { CRYPTO, EXCHANGES, EXCHANGE_ABRV, TIME } = require('./constants');
const formatDate = require('./date');
const { sendNotification } = require('./twilio');

const diffLogs = CRYPTO.reduce((logs, currency) => {
  logs[currency] = {
    difference: 0,
    level: 0,
    lastNotification: undefined,
    numNotifications: 0
  };

  return logs;
}, {});

const notificationLog = [];

let lastNotification = Date.now() - 5 * TIME.MINUTE;

exports.getNotifications = function getNotifications() {
  return { notifications: notificationLog };
};

exports.diff = function diff(prices) {
  const now = Date.now();
  const notifications = [];
  const urgent = [];

  CRYPTO.forEach(currency => {
    const exchangeDifferences = EXCHANGES.reduce((differences, buyFrom) => {
      const buyMarket = prices[currency][buyFrom];

      if (!buyMarket || !buyMarket.withdrawalsEnabled || !buyMarket.ask) return differences;

      EXCHANGES.forEach(sellAt => {
        if (buyFrom === sellAt) return;

        const sellMarket = prices[currency][sellAt];

        if (!sellMarket || !sellMarket.depositsEnabled || !sellMarket.bid) return;

        differences.push({
          buy: buyFrom,
          sell: sellAt,
          bid: sellMarket.bid,
          ask: buyMarket.ask,
          difference: sellMarket.bid - buyMarket.ask
        });
      });

      return differences;
    }, []).sort((a, b) => {
      if (a.difference < b.difference) return -1;
      if (a.difference > b.difference) return 1;

      return 0;
    });

    if (exchangeDifferences.length === 0) return;

    const diffLog = diffLogs[currency];

    const greatest = exchangeDifferences[exchangeDifferences.length - 1];
    const percentage = (greatest.difference / greatest.bid * 100).toFixed(2);

    let level = 0;

    if (percentage > 50) level += 1;
    if (percentage > 40) level += 1;
    if (percentage > 30) level += 1;
    if (percentage > 25) level += 1;
    if (percentage > 20) level += 1;
    if (percentage > 15) level += 1;
    if (percentage > 10) level += 1;
    if (percentage > 7)  level += 1;
    if (percentage > 5)  level += 1;
    if (percentage > 4)  level += 1;
    if (percentage > 3)  level += 1;
    if (percentage > 2)  level += 1;
    if (percentage > 1)  level += 1;

    const isKucoin = greatest.buy === 'kucoin' || greatest.sell == 'kucoin';

    if (isKucoin && level > 2 || !isKucoin && level > 1) {
      const buyFrom = EXCHANGE_ABRV[greatest.buy];
      const sellAt = EXCHANGE_ABRV[greatest.sell];

      console.log(`${currency} is cheaper at ${greatest.buy}: ${percentage}%`);
      console.log(`${buyFrom}: ${greatest.ask}, ${sellAt}: ${greatest.bid}`);
      console.log(`Previously the difference was ${diffLog.difference}%`);

      const notification =
        `${currency}: ${percentage}%, ${buyFrom} ${greatest.ask}, ${sellAt} ${greatest.bid}`;

      notifications.push(notification);

      if (level > 4) urgent.push(notification);

      diffLog.lastNotification = now;
      diffLog.numNotifications += 1;
    }

    if (level > 0) {
      if (notificationLog.length > 500) notificationLog.shift();

      notificationLog.push([
        `${currency} is cheaper at ${greatest.buy}: ${percentage}%`,
        `${greatest.buy}: ${greatest.ask}, ${greatest.sell}: ${greatest.bid}`,
        `Previously the difference was ${diffLog.difference}%`,
        formatDate(new Date())
      ].join('\n'))
    }

    diffLog.difference = percentage;
    diffLog.level = level;
  });

  if (now - lastNotification > 5 * TIME.MINUTE && notifications.length > 0) {
    lastNotification = now;

    console.log('Sending notifications', notifications.join('; '));

    sendNotification(notifications.join('; '));
  } else if (now - lastNotification > 30 * TIME.SECOND && urgent.length > 0) {
    lastNotification = now;

    console.log('Sending urgent notifications', urgent.join('; '));

    sendNotification(urgent.join('; '));
  }
}
