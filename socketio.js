const express = require('express');

const app = express();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const apiRoute = require('./routes/api');


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

global.users = [];
global.io = io;

function addSocketId(users, info) {
  const { tokenId, userId, socketId } = info;
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    if (user.tokenId === tokenId) {
      if (user.socketIds.indexOf(socketId) === -1) {
        user.socketIds.push(socketId);
      }
      return;
    }
  }
  users.push({
    userId,
    tokenId,
    socketIds: [socketId],
  });
}

function deleteSocketId(users, socketId) {
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    const socketIdIndex = user.socketIds.indexOf(socketId);
    if (socketIdIndex > -1) {
      user.socketIds.splice(socketIdIndex, 1);
      if (user.socketIds.length === 0) {
        users.splice(i, 1);
        break;
      }
    }
  }
}

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected ', socket.id);
    deleteSocketId(global.users, socket.id);
  });
  socket.on('user login', (info) => {
    const { tokenId, userId, socketId } = info;
    io.sockets.to(socketId).emit('pushEvent', { message: `message from socketio server to ${userId}` });
    console.log(info);
    addSocketId(global.users, { tokenId, userId, socketId });
  });
});

app.post('/api', apiRoute);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

http.listen(4000, () => {
  console.log('socket.io server is running at the port 4000');
});

