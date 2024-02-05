const io = require('socket.io')(443, {
  cors:{
    origin:'*:*'
  },
});

let users = [];

console.log('socket auki omassa tiedostossa?')
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

//When connect
io.on('connect', (socket) => {
  console.log(`a user connected: ${socket.id}`)
  socket.on('addUser', userId=>{
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });


  //Send and Get messages
  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit('getMessage', {
        senderId,
        text
      });
    }
  });

  //Handle Notifications
  socket.on('sendNotification', ({ senderName, receiverId, type }) => {
    const user = getUser(receiverId);
    if (user) {
      console.log('sending notification')
      io.to(user.socketId).emit('getNotification', {
        senderName,
        type
      });
    }
  });

  //When disconnect
  socket.on('disconnect', ({}) => {
    console.log('a user has disconnected!')
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});


