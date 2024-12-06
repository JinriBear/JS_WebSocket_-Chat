const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log("연결");

  ws.on('close', () => {
    console.log("연결 종료");
  })
});