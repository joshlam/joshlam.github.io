const WebSocket = require('ws');
const pako = require('pako');

exports.init = function init(url, subscribe, handler) {
  const ws = new WebSocket(url);
  const wsStore = { ws, closed: false };

  ws.on('open', () => {
    console.log('socket open');

    subscribe(ws);
  });

  ws.on('message', data => {
    const text = pako.inflate(data, { to: 'string' });
    const message = JSON.parse(text);

    if (message.ping) {
      ws.send(JSON.stringify({ pong: message.ping }));
    } else if (message.tick) {
      handler(message);
    } else {
      console.log(`socket message: ${JSON.stringify(message)}`);
    }
  });

  ws.on('error', error => {
    console.log(`socket error: ${error}`);

    init(url, subscribe, handler);
  });

  ws.on('close', () => {
    console.log('socket close');

    if (wsStore.closed) return;

    init(url, subscribe, handler);
  });

  return wsStore;
};
