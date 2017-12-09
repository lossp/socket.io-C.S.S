const express = require('express');

const router = express.Router();


// 首先对用户进行遍历，如果tokenId匹配相应用户，取到用户的socketIds
function getSocketId(users, tokenId) {
  // 同一用户会打开多个页面，存在多个socketId
  let result = [];
  users.forEach((user) => {
    if (user.tokenId === tokenId) {
      result = user.socketIds;
    }
  });
  return result;
}


router.post('/api', (req, res) => {
  const { tokens = [], message = '' } = req.body;
  console.log(req.body);

  console.log('--------===-------');
  tokens.forEach((tokenId) => {
    const socketIds = getSocketId(global.users, tokenId);
    // 对用户的socketId进行遍历，对每个socketId发送消息，因为一个用户可能打开多个页面
    socketIds.forEach((socketId) => {
      global.io.sockets.to(socketId).emit('pushEvent', message);
    });
  });
  console.log(tokens);
  console.log(message);
  res.send({
    status: 200,
    data: 'ok!',
  });
});


module.exports = router;

