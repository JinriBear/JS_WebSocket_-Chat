const chatLog = document.querySelector('#chat-log');
const chatForm = document.querySelector('#chat-input-container');
const chatInputBox = document.querySelector("#chat-input-box");
const modal = document.querySelector("#modal-bg")
const modalInput = document.querySelector('#nickname');
const modalBtn = document.querySelector('#set-Nickname');
let socket;

const ClientInfo = function(nickname) {
  this.type = "connect";
  this.nickname = nickname;
  this.content = "";
}

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
    const message = document.createElement("b");
    message.innerText = content;
    div.append(message);
    chatLog.append(div);
  }

  // 메시지를 받으면 채팅내역 스크롤 제일 아래로 내림
  chatLog.scrollTop = chatLog.scrollHeight;
}

modalBtn.addEventListener('click', function() {
  const nickname = modalInput.value;

  if(nickname === ""){
    alert("닉네임을 입력해주세요");
    return;
  }

  const clientInfo = new ClientInfo(nickname);
  modal.style.display = "none";
  socket = new WebSocket("ws://localhost:8080");

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
})





