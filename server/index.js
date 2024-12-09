const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const handleMessage = (msg) => {
  const type = msg.type;
  const nickname = msg.nickname;
  const content = msg.content;
  
  const handleType = {
    connect: JSON.stringify({
      type: type,
      content: `${nickname}님께서 접속하셨습니다.`,
    }),
    close: JSON.stringify({
      type: type,
      content: `${nickname}님께서 접속을 종료하였습니다.`,
    }),
    chat: JSON.stringify({
      type: type,
      nickname: nickname,
      content: content,
    }),
  };

  return handleType[type];
}

const broadcaseMessage = (server, message) => {
  server.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN)
      client.send(message);
    });
};

wss.on('connection', (ws) => {
  
  ws.on('message', (msg) => {
    const jsonParse = JSON.parse(msg.toString());
    console.log(jsonParse);
    const message = handleMessage(jsonParse);
    broadcaseMessage(wss, message);
  })


  ws.on('close', () => {
    console.log("연결 종료");
  })
});