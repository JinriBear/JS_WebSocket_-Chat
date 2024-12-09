const socket = new WebSocket("ws://localhost:8080");
const chatLog = document.querySelector('#chat-log');
const chatForm = document.querySelector('#chat-input-container');
const chatInputBox = document.querySelector("#chat-input-box");

const clientInfo = {
  type: "connect",
  nickname: "윈도우",
  content: "",
};

const handleMessage = (msg) => {
  const type = msg.type;
  const nickname = msg.nickname;
  const content = msg.content;
  const div = document.createElement("div");

  if(type === "chat") {
    const message = document.createElement('p');
    message.innerText = `${nickname}: ${content}`;
    div.append(message);
    chatLog.append(div);
  }  
  if(type === "connect" || type === "close"){
    const message = document.createElement("p");
    message.innerText = content;
    div.append(message);
    chatLog.append(div);
  }
}

socket.addEventListener('open', () => {
  socket.send(JSON.stringify(clientInfo));
});

socket.addEventListener('message', (event) => {
  const jsonParse = JSON.parse(event.data);
  handleMessage(jsonParse);
})

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if(chatInputBox === "")
    return;
  clientInfo.type = "chat"
  clientInfo.content = chatInputBox.value;
  socket.send(JSON.stringify(clientInfo));

  chatInputBox.value = "";
})