const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on('connection', (socket) => {

  console.log('A user connected');

  socket.on('setUsername', (username) => {
    socket.username = username;
    console.log(`${socket.username} has joined the chat.`);
    socket.emit('setStartTimestamp', Date.now());
  });

  socket.on('setStartTimestamp', function (startTimestamp) {
    const banner = document.getElementById('banner');
    const formattedStartTimestamp = new Date(startTimestamp).toLocaleTimeString();
    banner.textContent = `Messages start from: ${formattedStartTimestamp}`;
  });
  
  socket.on('chat message', (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const fullMessage = {
        username: socket.username,
        message: message,
        timestamp: timestamp
      };
    console.log(`${fullMessage.timestamp}::${fullMessage.username} : ${fullMessage.message}`);
    io.emit('chat message', fullMessage); 
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

});
 