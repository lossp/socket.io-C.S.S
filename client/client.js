const listenUrl = 'http://localhost:4000';

const msgSocket = io(listenUrl, {
  reconnectionAttempts: 10,
  // 限制对于 socket 服务器的重连次数为10次
});

const tokenId = prompt('Please enter your tokenId', '1');
const userId = Math.floor(Math.random().toFixed(4) * 10000);

msgSocket.on('connect', () => {
  msgSocket.emit('user login', {
    userId,
    socketId: msgSocket.id,
    tokenId,
  });
});

msgSocket.on('pushEvent', (data) => {
  console.log(data);
});

msgSocket.on('pushEvent', (msg) => {
  console.log('Here is message we got in client:', msg);
});
