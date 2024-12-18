const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const userList = new Map();

const handleMessage = (msg, ws) => {
  const type = msg.type;
  const nickname = msg.nickname;
  const content = msg.content;

  const handleType = {
    connect: () => {
      userList.set(ws, nickname);
      return {
        type: "connect",
        content: `${nickname}님께서 접속하셨습니다.`,
      };
    },
    close: () => {
      userList.delete(ws);
      return {
        type: "close",
        content: `${nickname}님께서 접속을 종료하였습니다.`,
      }
    },
    chat: () => {
      return {
        type: "chat",
        nickname: nickname,
        content: content,
      }
    },
  }
  return handleType[type]();
}

const broadcaseMessage = (server, message) => {
  server.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN)
      client.send(JSON.stringify(message));
    });
};

wss.on('connection', (ws) => {

  ws.on('message', (msg) => {
    const jsonParse = JSON.parse(msg.toString());
    const message = handleMessage(jsonParse, ws);
    broadcaseMessage(wss, message)
  })

  ws.on('close', () => {
    const message = handleMessage({
      type: "close",
      nickname: userList.get(ws),
    }, ws);
    broadcaseMessage(wss, message);
  })
});