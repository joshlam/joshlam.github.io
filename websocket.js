const WebSocket = require('ws');
const pako = require('pako');

exports.init = function init(url, subscribe, handler) {
  const ws = new WebSocket(url);

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

  return ws;
};
